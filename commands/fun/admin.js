const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const profileModel = require("../../models/profileSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("admin")
    .setDescription("Everyone can add or remove!")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    //Adding property
    .addSubcommand((subcommand) =>
      subcommand
        .setName("add")
        .setDescription("Add coins to a users balance")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user wants to add coins to")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of coins to add")
            .setRequired(true)
            .setMinValue(1)
        )
    )
   // Subtraction property
    .addSubcommand((subcommand) =>
      subcommand
        .setName("subtract")
        .setDescription("Subtract coins to a users balance")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("The user wants to subtract coins from")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("amount")
            .setDescription("The amount of coins to subtract")
            .setRequired(true)
            .setMinValue(1)
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const adminSubcommand = interaction.options.getSubcommand();


    if (adminSubcommand === "add") {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        await profileModel.findOneAndUpdate(
            {
                userId: user.id,
            },
            {
                $inc: {
                    balance: amount,
                },
            }
        );

        await interaction.editReply(
            `Added ${amount} to ${user.username}'s balance`
        );
    }

    if (adminSubcommand === "subtract") {
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");

        await profileModel.findOneAndUpdate(
            {
                userId: user.id,
            },
            {
                $inc: {
                    balance: -amount,
                },
            }
        );

        await interaction.editReply(
            `Subtracted ${amount} to ${user.username}'s balance`
        );
    }
  },
};
