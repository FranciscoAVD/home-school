import { mkdir, writeFile } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// Get the feature name from the command line arguments
const featureName = process.argv[2];

if (!featureName) {
  console.error(
    "Usage: bun generate-feature.ts <feature-name>",
  );
  process.exit(1);
}

const srcDir = "src";
const featuresDir = path.join(srcDir, "features");
const featureDir = path.join(featuresDir, featureName);

async function generateFeatureStructure() {
  try {
    // 1. Create 'src' directory if it doesn't exist
    if (!existsSync(srcDir)) {
      await mkdir(srcDir);
      console.log(`Created directory: ${srcDir}`);
    }

    // 2. Create 'features' parent folder if it does not already exist
    if (!existsSync(featuresDir)) {
      await mkdir(featuresDir);
      console.log(`Created directory: ${featuresDir}`);
    }

    // 3. Create the feature folder
    if (existsSync(featureDir)) {
      console.warn(
        `Feature folder '${featureName}' already exists. Skipping creation.`,
      );
      return;
    }
    await mkdir(featureDir);
    console.log(`Created feature folder: ${featureDir}`);

    // Define the subdirectories and files to create
    const subdirectories = [
      path.join(featureDir, "lib"),
      path.join(featureDir, "stores"),
      path.join(featureDir, "use-cases"),
      path.join(featureDir, "components"),
    ];

    const files = [
      {
        path: path.join(featureDir, "lib", "constants.ts"),
        content: "// Feature-specific constants",
      },
      {
        path: path.join(featureDir, "lib", "types.ts"),
        content: "// Feature-specific types",
      },
      {
        path: path.join(featureDir, "lib", "schemas.ts"),
        content:
          "// Feature-specific Zod schemas or similar",
      },
      {
        path: path.join(featureDir, "lib", "utils.ts"),
        content: "// Feature-specific utilities",
      },
      {
        path: path.join(featureDir, "lib", "hooks.ts"),
        content: "// Feature-specific utilities",
      },
      /*
      {
        path: path.join(
          featureDir,
          "stores",
          `${featureName}-store.ts`,
        ),
        content: `// Zustand store ${featureName}`,
      },
      */
    ];

    // Create subdirectories
    for (const dir of subdirectories) {
      await mkdir(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }

    // Create files
    for (const file of files) {
      await writeFile(file.path, file.content);
      console.log(`Created file: ${file.path}`);
    }

    console.log(
      `\nFeature '${featureName}' structure generated successfully!`,
    );
  } catch (error) {
    console.error(
      "Error generating feature structure:",
      error,
    );
    process.exit(1);
  }
}

generateFeatureStructure();
