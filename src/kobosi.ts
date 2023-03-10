import { startServer, restartServer } from "./startServer";
import { Genealogist } from "genealogist";
import chokidar from "chokidar";

const main = async (entryPoint: string, outputDir: string) => {
	const genealogist = new Genealogist();
	chokidar.watch(outputDir).on("all", async (eventName, path) => {
		await restartServer(entryPoint, () => {
			const ancestors = genealogist.getAncestors(path);
			for (const ancestor of ancestors) {
				require.cache[ancestor] = undefined;
			}
			console.log("serverWillStart");
		});
	});
	genealogist.watch();
	await startServer(entryPoint);
};
