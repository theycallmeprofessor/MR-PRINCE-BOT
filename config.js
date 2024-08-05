import { watchFile, unwatchFile } from 'fs'
import chalk from 'chalk'
import { fileURLToPath } from 'url'
import fs from 'fs'

import dotenv from 'dotenv'
dotenv.config()

const ownervb = process.env.OWNERS;
if (!ownervb){
   throw new Error("OWNERS env is not set");
}

const ownerlist = ownervb.split(';');

global.owner = [];
for (let i = 0; i < ownerlist.length; i += 2) {
    const owner = [
        ownerlist[i],            
        ownerlist[i + 1],         
        true                        
    ];
    global.owner.push(owner);
}

//💌------------------------------------------💌


//💌global.pairingNumber = "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUxkS3B1bTBScHpyY3doNmRlSE8rUGpPQkFSLzZxeEF6cmFNc1BXUStVZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUW83MlA5R3JlQjdabk5VSnFDT2RXbWE0YUxTRCtzZmsrQ0RNdGNMK3lVOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4UExpSDd6Rmd6T2dDVUVoVUlXZlBjckV0Ymhidk5QYTI2NDZKVkIxL1Z3PSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJZZ2RJcmdQMGRqbnVOd0VMMEszQWRXZVlxS2NDZGszWHNYMnNFZHlXakZvPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImlJV3pFTHJsMy9XckZEelBFa1JWazVNWjZzZjJiRGJ1emxIVEU5Y09aRVk9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRpdzlhQnBrWW9LVWZTU3JPNytWTUpUOWE4QjRDKzEwNXFqUVpNZzQ2bUU9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUdoYkxJVmNmU0ZGcEdJOWdCME9iWDlLbWdLZXc5S1BTWHEyZUs2b0pWMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieEFhTWdadFBoYWFqUUxPdWhrU3VReHgzV2IxdzJZN0RCL1I5SmY4bFNDND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlBzY3h0M0kyaG9raktDeHJsUkhHenU5bGlvVzBsVFRMU3c5MTBrdGF6Y29SUWZvSkNzSjZ3blJ1bUJRVW13MXF0RnpIZ256emU0SXN0WGw5Y1JiYmdBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6OTksImFkdlNlY3JldEtleSI6Indnb0k1T1ZSMGgvaWpkZEN4M25LSi8yYU83MG5POS9pN3V4NWZZWHNmeDg9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzMTY4MDY2NjM3QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkVBNDVBNENDMEUxMzU4RTAwQkJDRUU1ODY2ODc0QTA1In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3MjI4OTQ0Mjd9LHsia2V5Ijp7InJlbW90ZUppZCI6IjkyMzE2ODA2NjYzN0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI5MURGMzdFNzQ1QjU3QkYxN0JCNkJDQUI2NzVCMzI5MSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzIyODk0NDI3fV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJpWVRUN1JOYlJCYXIyRFowX2JFTnpBIiwicGhvbmVJZCI6IjY2N2M2YjM0LWFiOGYtNGZhMS04MDcyLTllMGNjZDQ4ODQwYSIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJyTjZKTExROVozbEhTRlpJbXp2ZGNFRndtWnc9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMVUyZVVqajRWN1c5SEYwQ0ZqTkJsOHltNmEwPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6Ik1EUFdYMUtIIiwibWUiOnsiaWQiOiI5MjMxNjgwNjY2Mzc6NTRAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiTS14LU0iLCJsaWQiOiIyODA1MDA0NTU0MDM3NDQ6NTRAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNNcUI3RW9ReUpERnRRWVlDaUFBS0FBPSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJKa3c0bnlLOFZwZWxuNlIvazlzYlBOanRCYUxvKytYcFdneVNDRDBNTFI0PSIsImFjY291bnRTaWduYXR1cmUiOiJ5dmdXQnIxWlhKa0E5UnBrYnRKTlI3M2orVS9CYXYydVNNVjVHd0hzSWlzRDQwK2o2ck1PKzBPWktPTWZPbTIzSXUrNVQ4YWxpTGdIdUdzU1oxdnVBdz09IiwiZGV2aWNlU2lnbmF0dXJlIjoiME9rYm5Cd3RUUThGNDY3OXZZZUNRNG52Um5BdW5BbkdRVkVzZ0FOblhTUjA3NGtUYkFYdkh3ckY1SXkvWjFtY3ZEYmZxaXpvZ3pHeVN3YnBESkhsakE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5MjMxNjgwNjY2Mzc6NTRAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCU1pNT0o4aXZGYVhwWitrZjVQYkd6elk3UVdpNlB2bDZWb01rZ2c5REMwZSJ9fV0sInBsYXRmb3JtIjoic21iYSIsImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTcyMjg5NDQyMSwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFESzYifQ==" //put your bot number here💌
global.mods = ['923168066637'] 
global.prems = ['']
global.allowed = ['']
global.keysZens = ['c2459db922', '37CC845916', '6fb0eff124']
global.keysxxx = keysZens[Math.floor(keysZens.length * Math.random())]
global.keysxteammm = ['29d4b59a4aa687ca', '5LTV57azwaid7dXfz5fzJu', 'cb15ed422c71a2fb', '5bd33b276d41d6b4', 'HIRO', 'kurrxd09', 'ebb6251cc00f9c63']
global.keysxteam = keysxteammm[Math.floor(keysxteammm.length * Math.random())]
global.keysneoxrrr = ['5VC9rvNx', 'cfALv5']
global.keysneoxr = keysneoxrrr[Math.floor(keysneoxrrr.length * Math.random())]
global.lolkeysapi = ['GataDios']
//💌------------------------------------------💌



//💌------------------------------------------💌
//CONFIG VARS. Do not touch them⚠️

  global.vidcap = process.env.DL_MSG


//💌------------------------------------------💌



    
// APIS
global.APIs = {
  // API Prefix
  // name: 'https://website'
  xteam: 'https://api.xteam.xyz',
  dzx: 'https://api.dhamzxploit.my.id',
  lol: 'https://api.lolhuman.xyz',
  violetics: 'https://violetics.pw',
  neoxr: 'https://api.neoxr.my.id',
  zenzapis: 'https://zenzapis.xyz',
  akuari: 'https://api.akuari.my.id',
  akuari2: 'https://apimu.my.id',
  nrtm: 'https://fg-nrtm.ddns.net',
  bg: 'http://bochil.ddns.net',
  fgmods: 'https://api.fgmods.xyz'
}
// 💌------------------------------------------💌



//APIs keys
global.APIKeys = {
  // APIKey Here
  // 'https://website': 'apikey'
   'https://api.fgmods.xyz': 'm2XBbNvz',
  'https://api.xteam.xyz': 'd90a9e986e18778b',
  'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
  'https://api.neoxr.my.id': `${keysneoxr}`,
  'https://violetics.pw': 'beta',
  'https://zenzapis.xyz': `${keysxxx}`
   
}

//💌------------------------------------------💌



// Bot Images 
global.imagen1 = fs.readFileSync("./Assets/menus/Menu.png")
global.imagen2 = fs.readFileSync("./Assets/menus/Menu1.jpg")
global.imagen3 = fs.readFileSync("./Assets/menus/Menu2.jpg")
global.imagen4 = fs.readFileSync("./Assets/menus/Menu3.jpg")
global.imagen5 = fs.readFileSync("./Assets/menus/img2.jpg")
global.imagen6 = fs.readFileSync("./Assets/menus/img5.jpg")
global.imagen7 = fs.readFileSync("./Assets/menus/img6.jpg")
global.imagen8 = fs.readFileSync("./Assets/menus/img8.jpg")
global.imagen9 = fs.readFileSync("./Assets/menus/img9.jpg")
global.imagen10 = fs.readFileSync("./Assets/menus/img11.jpg")
global.imagen11 = fs.readFileSync("./Assets/menus/img12.jpg")
//💌------------------------------------------💌









// Randome
global.princeImg = [imagen1, imagen2, imagen3, imagen4, imagen5, imagen6, imagen7, imagen8, imagen9, imagen10, imagen11]
//💌------------------------------------------💌



// Moderator 
global.developer = 'https://wa.me/message/DCAK67ON3XVOG1' //contact
//💌------------------------------------------💌



//Sticker WM
global.botname = process.env.BOT_NAME
global.princebot = '🛡️𝘗𝘙𝘐𝘕𝘊𝘌-𝘉𝘖𝘛-𝘔𝘋🛡️'
global.packname = 'Prince♥️' 
global.author = 'Prince♥️' 
global.princeig = 'https://www.instagram.com' 
global.princegp = 'https://whatsapp.com/channel/0029VaKNbWkKbYMLb61S1v11'
global.menuvid = 'https://i.imgur.com/GFAAXqw.mp4'
global.Princesc = 'https://github.com/PRINCE-GDS/THE-PRINCE-BOT' 
global.princeyt = 'https://youtube.com/'
global.Princelog = 'https://i.imgur.com/cUvIv5w.jpeg'
global.thumb = fs.readFileSync('./Assets/Prince.png')
//💌------------------------------------------💌



//Reactions
global.wait = '*♻️ _RUKO Z4R4 SAB4R KARO..._*\n*▰▰▰▱▱▱▱▱*'
global.imgs = '*🖼️ _AA RAHI TASVEER  RUK..._*\n*▰▰▰▱▱▱▱▱*'
global.rwait = '♻️'
global.dmoji = '🤭'
global.done = '✅'
global.error = '❌' 
global.xmoji = '🌀' 
global.multiplier = 69 
global.maxwarn = '2' 
//💌------------------------------------------💌






let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  import(`${file}?update=${Date.now()}`)
})
