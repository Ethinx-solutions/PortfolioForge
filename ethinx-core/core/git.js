import simpleGit from "simple-git";

const git = simpleGit();

export async function autoCommit(message = "auto-update") {
  await git.add(".");
  await git.commit(message);
  await git.push();
}
