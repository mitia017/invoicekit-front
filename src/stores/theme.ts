import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(localStorage.getItem("theme") === "dark");

  const toggleDark = () => {
    isDark.value = !isDark.value;
    updateDOM();
  };

  const updateDOM = () => {
    if (isDark.value) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  updateDOM();

  return { isDark, toggleDark };
});
