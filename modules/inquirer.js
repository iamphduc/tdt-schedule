import inquirer from "inquirer";

export async function prompt() {
  return await inquirer.prompt([
    {
      type: "list",
      name: "headless",
      message: "Would you like to run with chromium",
      choices: [
        { value: false, name: "Yes" },
        { value: true, name: "No, run in silent mode" },
      ],
    },
    {
      type: "list",
      name: "save",
      message: "Choose how you want to save",
      choices: [
        { value: 1, name: "Save as file .json" },
        { value: 2, name: "Take screenshot" },
        { value: 3, name: "Both" },
      ],
    },
  ]);
}
