// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    css: ["assets/main.css"],
    modules: ["@pinia/nuxt"],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {}
        }
    },
    app: {
        head: {
            title: "EZMLA - MLA Citation Generator",
            meta: [
                { charset: "UTF-8" },
                { name: "viewport", content: "width=device-width, initial-scale=1.0" },
                {
                    hid: "description",
                    name: "description",
                    content: "Easily cite any website or article using MLA format for free, without ads!"
                },
                { name: "keywords", content: "mla, citation, generator, cite, format, ezmla, english, literature, paper, research" }
            ],
            link: [{ rel: "icon", type: "image/svg+xml", href: "/logoSmallBlue.svg" }]
        }
    }
});
