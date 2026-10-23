import { setTheme, saveTheme } from '../js/theme.js';

(function ()
{
    document.getElementById('theme').onclick = () => {
        const newTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        saveTheme(newTheme);
    }
}
)();