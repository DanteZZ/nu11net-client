import path from "path";

export const basedir =
    process?.env?.NODE_ENV && process?.env?.NODE_ENV?.indexOf("dev") >= 0
        ? process?.env?.PWD || process.cwd()
        : path.dirname(process.execPath);
