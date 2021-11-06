import { build, serve, BuildOptions } from "esbuild";
import { htmlPlugin } from "@craftamap/esbuild-plugin-html";
import cpx from "cpx";

const isDev = process.env.ENV === "dev";

const options: BuildOptions = {
  entryPoints: ["src/index.tsx"],
  bundle: true,
  minify: true,
  metafile: true,
  outdir: "dist",
  sourcemap: isDev,
  plugins: [
    htmlPlugin({
      files: [
        {
          entryPoints: ["src/index.tsx"],
          filename: "index.html",
          title: "coffee",
        },
      ],
    }),
  ],
};

// Copy the assets directory to dist
cpx.copy("assets/*", "dist/assets");

// Run an initial build
build(options).catch(() => process.exit(1));

if (isDev) {
  // Re-copy assets if any change
  cpx.watch("assets/*", "dist/assets");
  // Serve the contents of dist
  serve(
    {
      servedir: "dist",
      port: 8080,
    },
    options
  ).then((server) => {
    console.log(`Serving page at http://localhost:${server.port}`);
  });
}
