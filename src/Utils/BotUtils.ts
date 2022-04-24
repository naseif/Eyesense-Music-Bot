import type { MessageEmbedOptions } from "discord.js";

export function embed(description: string, options?: MessageEmbedOptions) {
    const embed = {
        description: description,
        color: options?.color || "#9dcc37",
        ...options
    };

    return embed
}
