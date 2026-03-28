<script setup lang="ts"></script>

<template>
    <h1>You did it!</h1>
    <p>
        Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
        documentation
    </p>
    <header>
        <nav>
            <RouterLink to="/">Home</RouterLink>
            {{ /**TODO more links here */ }}
        </nav>
    </header>
    <main>
        <RouterView />
    </main>
    <footer>

    </footer>
  <!-- <RouterView /> -->
</template>

<style scoped></style>
