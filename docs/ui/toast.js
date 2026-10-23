
const CSS = `
    .toast{
        position:fixed;
        left:50%;
        bottom:calc(92px + env(safe-area-inset-bottom,0px));
        transform:translate(-50%,10px);
        z-index:20;
        background:var(--accent);
        color:var(--bg);
        padding:10px 18px;
        border-radius:999px;
        font-size:.9rem;
        font-weight:500;
        opacity:0;pointer-events:none;
        transition:opacity .2s,transform .2s;
        white-space:nowrap
    }
    .toast.show{ 
        opacity:1;
        transform:translate(-50%,0)
    }
`

const HTML = `
    <div role="status"></div>
`

let element = null;
function createToastElement()
{
    if (element)
        return element;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.append(style);

    element = document.createElement('div');
    element.className = 'toast';
    element.innerHTML = HTML;
    document.body.append(element);

    return element;
}

export function toast(message)
{
    console.log('toast()')

    const element = createToastElement();

    element.textContent=message;
    element.classList.add('show');
    clearTimeout(element.timeout);
    element.timeout=setTimeout(()=>element.classList.remove('show'),2500);
}

(function()
{
    window.toast = function (message) {
        toast(message);
    }
}
)();