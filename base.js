/*
  If you are wondering "How do i add my own commands?!"
  You need to use this format below:
 */

module.exports = {
    description: '',
    aliases: [],
    usage: ''
}

module.exports.run = (client, message, args) => {

}

/*
  Its crucial to keep it in this order for it to properly function
  The command name must also be the name of the file
  And lastly, the code goes inside of the run function
  */