/**
 * WEBSOCKET SERVICE
 * Real-Time Sales Pings from Hetzner Controller Node
 * 
 * Connects to ws://91.99.162.243:3001 (or wss:// in production)
 * Emits sales events for Launch Sentry and Neural Recon
 */

export interface SalesEvent {
  id: string;
  type: "checkout_completed" | "payment_succeeded" | "neural_recon_alert";
  amount: number;
  tier: string;
  sessionId?: string;
  customer?: string;
  timestamp: string;
  isHighValue?: boolean;
}

export interface WebSocketConfig {
  url: string;
  reconnectInterval: number;
  maxReconnectAttempts: number;
  heartbeatInterval: number;
}

export class WebSocketService {
  private ws: WebSocket | null = null;
  private config: WebSocketConfig;
  private reconnectAttempts = 0;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private messageHandlers: Map<string, (data: any) => void> = new Map();
  private isIntentionallyClosed = false;

  constructor(config: Partial<WebSocketConfig> = {}) {
    this.config = {
      url: config.url || "ws://91.99.162.243:3001",
      reconnectInterval: config.reconnectInterval || 5000,
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      heartbeatInterval: config.heartbeatInterval || 30000,
    };
  }

  /**
   * Connect to WebSocket server
   */
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        console.log(`🔌 Connecting to WebSocket: ${this.config.url}`);
        this.ws = new WebSocket(this.config.url);
        this.isIntentionallyClosed = false;

        this.ws.onopen = () => {
          console.log("✓ WebSocket connected");
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          this.emit("connected");
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error);
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          this.emit("error", error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log("WebSocket closed");
          this.stopHeartbeat();
          this.emit("disconnected");

          if (!this.isIntentionallyClosed) {
            this.attemptReconnect();
          }
        };
      } catch (error) {
        console.error("Failed to create WebSocket:", error);
        reject(error);
      }
    });
  }

  /**
   * Disconnect from WebSocket server
   */
  public disconnect(): void {
    this.isIntentionallyClosed = true;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    console.log("WebSocket disconnected");
  }

  /**
   * Send message to server
   */
  public send(type: string, data: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    try {
      const message = { type, data, timestamp: new Date().toISOString() };
      this.ws.send(JSON.stringify(message));
    } catch (error) {
      console.error("Failed to send WebSocket message:", error);
    }
  }

  /**
   * Register event handler
   */
  public on(event: string, handler: (data: any) => void): void {
    this.messageHandlers.set(event, handler);
  }

  /**
   * Unregister event handler
   */
  public off(event: string): void {
    this.messageHandlers.delete(event);
  }

  /**
   * Emit event to registered handlers
   */
  private emit(event: string, data?: any): void {
    const handler = this.messageHandlers.get(event);
    if (handler) {
      handler(data);
    }
  }

  /**
   * Handle incoming message
   */
  private handleMessage(data: any): void {
    const { type, payload } = data;

    switch (type) {
      case "sales_event":
        this.handleSalesEvent(payload);
        break;
      case "high_value_transaction":
        this.handleHighValueTransaction(payload);
        break;
      case "heartbeat_ack":
        console.log("💓 Heartbeat acknowledged");
        break;
      default:
        console.log(`Received message type: ${type}`, payload);
        this.emit(type, payload);
    }
  }

  /**
   * Handle sales event
   */
  private handleSalesEvent(event: SalesEvent): void {
    console.log(`📊 Sales Event: ${event.type}`);
    console.log(`   Amount: $${(event.amount / 100).toFixed(2)} AUD`);
    console.log(`   Tier: ${event.tier}`);

    // Emit to Launch Sentry
    this.emit("sales_event", event);

    // Dispatch custom event for React components
    window.dispatchEvent(
      new CustomEvent("sales-event", {
        detail: event,
      })
    );
  }

  /**
   * Handle high-value transaction
   */
  private handleHighValueTransaction(transaction: any): void {
    console.log("🚨 High-Value Transaction Detected");
    console.log(`   Amount: $${(transaction.amount / 100).toFixed(2)} AUD`);

    // Emit to Neural Recon Priority Queue
    this.emit("high_value_transaction", transaction);

    // Dispatch custom event for React components
    window.dispatchEvent(
      new CustomEvent("high-value-transaction", {
        detail: transaction,
      })
    );
  }

  /**
   * Start heartbeat to keep connection alive
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      this.send("heartbeat", { timestamp: new Date().toISOString() });
    }, this.config.heartbeatInterval);
  }

  /**
   * Stop heartbeat
   */
  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Attempt to reconnect
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.emit("max_reconnect_attempts_reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(`🔄 Reconnecting... (Attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error);
      });
    }, this.config.reconnectInterval);
  }

  /**
   * Get connection status
   */
  public isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get ready state
   */
  public getReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }
}

// Singleton instance
let wsServiceInstance: WebSocketService | null = null;

export function getWebSocketService(config?: Partial<WebSocketConfig>): WebSocketService {
  if (!wsServiceInstance) {
    wsServiceInstance = new WebSocketService(config);
  }
  return wsServiceInstance;
}

export default WebSocketService;
