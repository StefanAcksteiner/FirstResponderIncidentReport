const KEY = 'theme';

export function loadTheme()
{
    let saved = null;

    try {
        saved = localStorage.getItem(KEY);
    }
    catch {
    }

    return saved;
}

export function saveTheme(theme)
{
    try {
        localStorage.setItem(KEY, theme);
    }
    catch {
    }
}

export function hasSavedTheme()
{
    return loadTheme() === null;
}

export function initTheme()
{
    let theme = loadTheme();

    if (theme === null) {
        theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    document.documentElement.dataset.theme = theme;

    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!hasSavedTheme()) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}

export function setTheme(theme)
{
    document.documentElement.dataset.theme = theme;

    document.querySelector('meta[name=theme-color]').content = theme === 'dark' ? '#0c1014' : '#f4f6f8';
}