import readline from "node:readline/promises";
import fs from "node:fs"
const fsp = fs.promises
console.log("start")

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

process.on("uncaughtException", (e) => {

    console.log("")
    console.log("exited")
    process.exit(0)

})

console.clear()
console.log("Package name")
const name = await rl.question("> ")
if (await fsp.access("./packages/" + name.trim()).then(() => true, () => false)) {
    console.log(name, "package already exists!")
    process.exit(0)

}
console.log("Keywords (seperate with ,)")
const keywords = (await rl.question("> ")).split(",").map(k => k.trim())
console.log("Description")
const desc = await rl.question("> ")

console.log({ name, keywords, desc })

const packageJsonString = await fsp.readFile("./template/package.json")
const packageJson = JSON.parse(packageJsonString)
packageJson.name = "@thetally/" + name
packageJson.description = desc
packageJson.keywords = keywords
await fsp.mkdir("./packages/" + name)
await fsp.cp("./template/", "./packages/" + name, { recursive: true })
await fsp.writeFile("./packages/" + name + "/package.json", JSON.stringify(packageJson, null, 2))
process.exit(0)