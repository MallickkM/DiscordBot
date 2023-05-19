const { SlashCommandBuilder } = require("discord.js");

const profileModel = require('../../models/profileSchema');

//install package, can read hrs, mins, secs
const parseMilliseconds = require("parse-ms-2");

const { dailyMin, dailyMax } = require('../../globalValues.json');


module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Get ur free coins everyday!"),
  async execute(interaction, profileData) {
    const { id } = interaction.user;
    const { dailyLastUsed } = profileData;

    const cooldown = 86400000; //24hrs in milisec
    const timeLeft = cooldown - (Date.now() - dailyLastUsed);

    //Notification command
    if (timeLeft > 0) {
      await interaction.deferReply({ ephemeral: true });
      const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
      await interaction.editReply(
        `Claim your next daily in ${hours} hrs ${minutes} min ${seconds} sec`
      );
    }

    await interaction.deferReply();

    const randomAmt = Math.floor(
      Math.random() * (dailyMax - dailyMin + 1) + dailyMin
    );

    try {
        await profileModel.findOneAndUpdate(
            { userId: id },
            { 
                $set: { 
                    dailyLastUsed: Date.now(),
                },

                $inc: { 
                    balance: randomAmt,
                }
            }
        )

    } catch (err) {
        console.log(err);
    }

    await interaction.editReply(`You redeemed ${randomAmt} coins!`);
  },
};
