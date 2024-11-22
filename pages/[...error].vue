<template>
    <div class="flex h-svh w-screen flex-col items-center justify-center">
        <h1 class="text-xl font-bold">Sorry, we couldn't find this page!</h1>
        <p>Try looking for a different URL.</p>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

onMounted(() => {
    router.push("/");
});
</script>

<style scoped></style>
