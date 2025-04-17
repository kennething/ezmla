<template>
    <nav class="fixed right-3 top-3 flex items-center justify-center gap-2">
        <label class="du-swap du-swap-rotate select-none hover:scale-110">
            <!-- this hidden checkbox controls the state -->
            <input type="checkbox" class="theme-controller" :checked="isDarkMode" @click="isDarkMode = !isDarkMode" />

            <!-- sun icon -->
            <img class="du-swap-off h-10 w-10" src="/sunny-outline.svg" aria-hidden="true" />

            <!-- moon icon -->
            <img class="du-swap-on h-10 w-10 invert" src="/moon-outline.svg" aria-hidden="true" />
        </label>

        <button class="hover:scale-110" @click="openInfoModal = true">
            <img class="size-10 select-none dark:invert" src="/information-circle-outline.svg" alt="Open the information menu" />
        </button>
    </nav>

    <Transition name="infoModal">
        <div
            v-show="openInfoModal"
            class="fixed left-0 top-0 z-10 flex h-svh w-screen items-center justify-center bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(255,255,255,0.1)]"
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
