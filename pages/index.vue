<template>
    <div class="flex h-svh w-screen flex-col items-center justify-center gap-2 md:justify-start sm:my-20">
        <img class="dark:invert" :class="{ 'h-32': !citation, 'mb-20': !citation, 'mb-3': citation, 'h-16': citation }" src="/logo.svg" aria-hidden="true" />

        <form id="search" class="flex h-20 flex-col items-center justify-start gap-1" @submit.prevent="cite">
            <label class="du-input du-input-bordered flex w-[40rem] items-center gap-2 md:w-96 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Search by URL" v-model="url" />
                <button type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
                        <path
                            fill-rule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </button>
            </label>
            <p class="text-red-500">{{ error }}</p>
        </form>

        <div class="flex w-72 items-center justify-center gap-2">
            <button
                type="submit"
                form="search"
                class="w-1/2 rounded-xl border-2 border-[color:var(--faded-bg-color-dark)] py-2.5 hover:border-[color:var(--faded-bg-color-light)] hover:bg-[color:var(--faded-bg-color-light)]"
                :disabled="loading"
            >
                <span class="du-loading du-loading-spinner du-loading-sm" v-show="loading"></span> {{ loading ? "Loading" : "Cite" }}
            </button>

            <!-- yes hover needs to be conditional -->
            <button
                type="button"
                class="inline-flex w-1/2 items-center justify-center gap-2 rounded-xl bg-[color:var(--faded-bg-color-dark)] py-3"
                :class="{ 'hover:bg-[color:var(--faded-bg-color-light)]': !loading && citation, 'opacity-50': loading || !citation, 'cursor-not-allowed': loading || !citation }"
                :disabled="loading || !citation"
                @click="clear()"
            >
                New Citation
            </button>
        </div>

        <!-- yes hover needs to be conditional -->
        <button
            type="button"
            class="relative inline-flex min-h-10 items-center justify-center gap-2 overflow-hidden rounded-xl bg-[color:var(--secondary)] px-10 py-1.5 duration-500"
            :class="{ 'hover:scale-[1.15]': !loading && citation, copyButton: !loading && citation, 'opacity-50': loading || !citation, 'cursor-not-allowed': loading || !citation }"
            :disabled="loading || !citation"
            @click="copyCitation"
        >
            <img class="size-7 dark:invert" src="/copy-outline.svg" aria-hidden="true" />
            Copy Citation
        </button>

        <div v-show="citation" class="mt-8 flex w-[50rem] items-center justify-center rounded-xl border-2 border-[color:var(--faded-bg-color-dark)] p-4 md:w-96 sm:w-80">
            <p ref="citationText" class="w-3/4 text-wrap text-center transition-none">
                <span class="times-new-roman" :class="{ italic: part.bold }" v-for="part in formatDescription(citation)">{{ part.text }}</span>
            </p>
        </div>

        <form class="items-around mt-5 flex flex-col justify-center gap-3" v-show="citation">
            <label class="du-input du-input-bordered flex w-96 items-center gap-2 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Author" v-model="author" @input.prevent="citation = generateCitation()" />
            </label>
            <label class="du-input du-input-bordered flex w-96 items-center gap-2 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Title" v-model="title" @input.prevent="citation = generateCitation()" />
            </label>
            <label class="du-input du-input-bordered flex w-96 items-center gap-2 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Publisher" v-model="publisher" @input.prevent="citation = generateCitation()" />
            </label>
            <label class="du-input du-input-bordered flex w-96 items-center gap-2 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Date Published" v-model="published" @input.prevent="citation = generateCitation()" />
                <input class="text-black dark:invert" type="date" v-model="publishedDate" />
            </label>
            <label class="du-input du-input-bordered flex w-96 items-center gap-2 sm:w-80 dark:bg-[color:var(--faded-bg-color)]">
                <input type="text" class="grow" placeholder="Date Accessed" v-model="accessed" @input.prevent="citation = generateCitation()" />
                <input class="text-black dark:invert" type="date" v-model="accessedDate" />
            </label>
            <label class="du-label cursor-pointer">
                <span class="text-[color:var(--text-color)]">Include URL?</span>
                <input type="checkbox" :checked="addUrl" class="du-checkbox dark:invert" @click="addUrl = !addUrl" />
            </label>
        </form>
    </div>
</template>

<script setup lang="ts">
const url = ref("");
const citation = ref("");

useHead({
    title: () => (citation.value && url.value ? `${url.value} | ` : "") + "EZMLA - MLA Citation Generator"
});

type Data = {
    metadata: Record<string, string | null>;
};

const citationText = ref<HTMLElement>();

const editMode = ref(false);
const loading = ref(false);
const error = ref("");
watch(error, (val) => {
    if (val) loading.value = false;
});

const author = ref("");
const title = ref("");
const publisher = ref("");
const published = ref("");
const publishedDate = ref("");
watch(publishedDate, (val) => {
    if (!val) return;
    published.value = getDate(new Date(new Date(val).getTime() + 86400000).toString(), true);
    citation.value = generateCitation();
});
const accessed = ref("");
const accessedDate = ref("");
watch(accessedDate, (val) => {
    if (!val) return;
    accessed.value = getDate(new Date(new Date(val).getTime() + 86400000).toString());
    citation.value = generateCitation();
});
const addUrl = ref(true);
watch(addUrl, () => (citation.value = generateCitation()));

function clear(clearUrl = true) {
    if (clearUrl) url.value = "";
    citation.value = "";
    error.value = "";
    loading.value = false;
    editMode.value = false;
    author.value = "";
    title.value = "";
    publisher.value = "";
    published.value = "";
    publishedDate.value = "";
    accessed.value = "";
    accessedDate.value = "";
}

async function cite() {
    if (url.value.length <= 0) return (error.value = "Please enter a valid URL.");
    if (!url.value.includes("https://")) url.value = "https://" + url.value;
    if (!/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[^\s]*)?$/.test(url.value)) return (error.value = "Please enter a valid URL.");

    clear(false);
    loading.value = true;
    editMode.value = true;

    try {
        const data = await $fetch(`/api/getMetadata`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: { url: url.value }
        });
        if (!data || "error" in data) return (error.value = data?.error ?? "Something went wrong. Try again later.");

        citation.value = getCitation(data);
    } catch (fetchError) {
        if (fetchError instanceof Error) return (error.value = fetchError.message);
        error.value = "Something went wrong. Try again later.";
    } finally {
        loading.value = false;
    }
}

function getCitation(data: Data) {
    const metadata = data.metadata;

    author.value = metadata.author ?? metadata["article:author"] ?? "";
    title.value = metadata["og:title"] ?? metadata.title ?? "";
    publisher.value = metadata["og:site_name"] ?? "";
    published.value = getDate(metadata["last-modified"] ?? metadata["article:published_time"], true);
    if (published.value) publishedDate.value = `${new Date(published.value).getFullYear()}-${new Date(published.value).getMonth() + 1}-${new Date(published.value).getDate()}`;
    url.value = url.value.replace(/\?.*/, "");
    accessed.value = getDate(new Date().toString());
    accessedDate.value = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

    return generateCitation();
}

function generateCitation() {
    let output = "";

    if (author.value) output += `${author.value}. `;
    if (title.value) output += `**${title.value}**. `;
    if (publisher.value) output += `${publisher.value}, `;
    if (published.value) output += `${published.value}, `;
    if (addUrl.value) output += `${url.value}. `;
    output += accessed.value ? `Accessed ${accessed.value}.` : "";

    return output;
}

async function copyCitation() {
    if (!citationText.value) return;

    const content = citationText.value.innerHTML;
    const blob = new Blob([content], { type: "text/html" });
    const clipboardItem = new ClipboardItem({ "text/html": blob });

    try {
        await navigator.clipboard.write([clipboardItem]);
        alert("Citation copied to clipboard.");
    } catch (error) {
        alert("Failed to copy.");
        console.error(error);
    }
}

const months: Record<number, string> = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
};
function getDate(data: string | null, shortMonth = false) {
    if (!data) return "";

    const date = new Date(data);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${shortMonth ? month.slice(0, 3) + (month.length > 3 ? "." : "") : month} ${year}`;
}
</script>

<style scoped>
@keyframes tint {
    to {
        translate: 400% 0;
    }
    from {
        translate: -450% 0;
    }
}

.copyButton::before {
    content: "";
    height: 300%;
    background: linear-gradient(to right, var(--secondary-shade) 20%, transparent 30%, var(--secondary-shade) 40%, var(--secondary-shade));
    @apply absolute w-10 rotate-45 opacity-50;
    translate: -700% 0;
    animation: tint 1.5s infinite ease-in-out;
}
</style>
