
const fs = require('fs');
const path = require('path');

const execScript = async function(scriptPath) {
    const script = fs.readFileSync(path.resolve(__dirname, scriptPath), 'utf8');
  
    await db.raw(script).exec((err, res) => {
        if (err) console.log('Something wrong with sql script', scriptPath)
    })
  }

module.exports = {
    execScript
}

  