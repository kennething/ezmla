<template>
    <nav class="fixed right-3 top-3 flex items-center justify-center gap-2">
        <label class="du-swap du-swap-rotate select-none hover:scale-110">
            <!-- this hidden checkbox controls the state -->
            <input type="checkbox" class="theme-controller" :checked="isDarkMode" @click="isDarkMode = !isDarkMode" />

            <!-- sun icon -->
            <svg class="du-swap-off h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
                />
            </svg>

            <!-- moon icon -->
            <svg class="du-swap-on h-10 w-10 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                    d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
                />
            </svg>
        </label>

        <button class="hover:scale-110" @click="openInfoModal = true">
            <img class="size-10 select-none dark:invert" src="/information-circle-outline.svg" alt="Open the information menu" />
        </button>
    </nav>

    <Transition name="infoModal">
        <div
            v-show="openInfoModal"
            class="fixed left-0 top-0 z-10 flex h-svh w-screen items-center justify-center bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(255,255,255,0.15)]"
            @click.stop="openInfoModal = false"
        >
            <div class="menu flex flex-col items-center justify-start gap-4 rounded-xl bg-[color:var(--bg-color)] p-10" @click.stop>
                <h2 class="text-3xl font-bold"><span class="text-3xl font-bold text-[#008CFF] dark:invert">EZ</span>MLA - MLA Citation Generator</h2>
                <p class="text-2xl font-medium">Changelog</p>

                <div class="flex max-h-[70svh] w-full flex-col items-start justify-center gap-2 overflow-y-scroll">
                    <div v-for="change in [...changelog].reverse()" class="flex w-full flex-col items-start justify-center">
                        <p class="text-lg font-bold">v{{ change.version }}</p>
                        <p class="text-lg">{{ change.date.toLocaleString(undefined, { month: "long", day: "numeric", year: "numeric" }) }}</p>
                        <p>{{ change.description }}</p>
                    </div>
                </div>

                <div class="mt-2 flex w-full items-center justify-around">
                    <p>Made by Kenneth Ng</p>
                    <p>Version {{ changelog[changelog.length - 1].version }}</p>
                    <a href="https://github.com/kennething/ezmla" target="_blank"><img class="size-8 dark:invert" src="/logo-github.svg" alt="Follow my GitHub" /></a>
                </div>
            </div>
        </div>
    </Transition>

    <NuxtPage />
</template>

<script setup lang="ts">
const route = useRoute();
const store = useUserStore();
const { isDarkMode } = storeToRefs(store);

useSeoMeta({
    title: "EZMLA - MLA Citation Generator",
    ogTitle: "EZMLA - MLA Citation Generator",
    ogImage: "https://ezmla.netlify.app/logo.png",
    description: "Easily cite any website or article using MLA format for free, without ads!",
    ogDescription: "Easily cite any website or article using MLA format for free, without ads!",
    ogSiteName: "EZMLA",
    ogUrl: "https://ezmla.netlify.app",
    twitterCard: "summary_large_image",
    twitterImage: "https://ezmla.netlify.app/logoSmallBlue.png",
    author: "Kenneth Ng"
});

useHead({
    link: () => (isDarkMode.value ? [{ rel: "icon", type: "image/svg+xml", href: "/logoSmallOrange.svg" }] : [{ rel: "icon", type: "image/svg+xml", href: "/logoSmallBlue.svg" }])
});

const openInfoModal = ref(false);

watch(isDarkMode, () => {
    document.body.classList.toggle("dark", isDarkMode.value);
    localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
});

onMounted(() => {
    if (route.query.changelog) openInfoModal.value = true;

    const theme = localStorage.getItem("theme");
    if (theme && theme == "dark") {
        isDarkMode.value = true;
        document.body.classList.add("dark");
    }
    document.body.style.display = "block";
});
</script>

<style scoped>
.infoModal-enter-active,
.infoModal-leave-active {
    transition: opacity 0.25s ease;
}

.infoModal-enter-from,
.infoModal-leave-to {
    opacity: 0;
}

.infoModal-enter-from .menu,
.infoModal-leave-to .menu {
    transform: scale(0.75);
}
</style>
