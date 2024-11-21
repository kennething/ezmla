<template>
    <div class="flex flex-col items-center justify-center">
        <button @click="fetch">fetch</button>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

onMounted(() => {});

async function fetch() {
    const url = "https://google.com"; // Replace with the target URL
    const data = await $fetch(`/api/getMetadata`, {
        body: {
            url
        }
    }).then((res) => res.json());
    console.log(data);
}
</script>

<style scoped></style>
