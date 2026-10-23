/*
 * Usage:
 *   if (await confirmDialog({ title: 'Delete?', message: '…', confirmText: 'Delete', danger: true })) { … }
 *
 * Options: title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false
 * Returns a Promise<boolean>. Markup and styles are injected on first use.
 *
 * Expects these CSS variables from the host page theme:
 *   --surface --line --text --muted --scrim --shadow-lg --danger --danger-soft --on-danger
 *   --accent --accent-strong --on-accent --surface-2
 */

const CSS = `
    .confirm_dialog_modal{position:fixed;inset:0;z-index:30;background:var(--scrim,rgba(0,0,0,.5));display:flex;align-items:center;justify-content:center;padding:20px;animation:confirm_dialog_fade .15s}
    .confirm_dialog_modal[hidden]{display:none}
    .confirm_dialog_dialog{width:100%;max-width:360px;background:var(--surface,#fff);color:var(--text,#111);border:1px solid var(--line,#ddd);border-radius:26px;padding:26px 22px 20px;text-align:center;box-shadow:var(--shadow-lg,0 10px 40px rgba(0,0,0,.3));animation:confirm_dialog_pop .2s cubic-bezier(.2,.9,.3,1.2)}
    .confirm_dialog_icon{width:52px;height:52px;border-radius:50%;display:grid;place-items:center;margin:0 auto 14px;background:var(--danger-soft,#fdeaea);color:var(--danger,#d64545)}
    .confirm_dialog_icon[hidden]{display:none}
    .confirm_dialog_icon svg{width:22px;height:22px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
    .confirm_dialog_dialog h3{margin:0 0 6px;font-size:1.15rem;letter-spacing:-.01em}
    .confirm_dialog_dialog p{margin:0 0 22px;color:var(--muted,#666);font-size:.95rem;word-break:break-word}
    .confirm_dialog_actions{display:flex;gap:10px}
    .confirm_dialog_button{flex:1;min-height:48px;padding:0 18px;border-radius:999px;border:1px solid var(--line,#ddd);background:var(--surface,#fff);color:var(--text,#111);font:inherit;font-weight:600;font-size:.92rem;cursor:pointer;transition:background .15s,transform .1s,filter .15s}
    .confirm_dialog_button:hover{background:var(--surface-2,#eee)}.confirm_dialog_button:active{transform:scale(.97)}
    .confirm_dialog_button.primary{background:var(--accent,#0f9d7a);border-color:var(--accent,#0f9d7a);color:var(--on-accent,#fff)}
    .confirm_dialog_button.primary:hover{background:var(--accent-strong,#0b7f62)}
    .confirm_dialog_button.danger{background:var(--danger,#d64545);border-color:var(--danger,#d64545);color:var(--on-danger,#fff)}
    .confirm_dialog_button.danger:hover{filter:brightness(.92)}
    .confirm_dialog_button:focus-visible{outline:2px solid var(--accent,#0f9d7a);outline-offset:2px}
    @keyframes confirm_dialog_fade{from{opacity:0}}
    @keyframes confirm_dialog_pop{from{transform:scale(.92);opacity:0}}
    @media (prefers-reduced-motion:reduce){.confirm_dialog_modal,.confirm_dialog_dialog{animation:none}}`;

const HTML = `
    <div class="confirm_dialog_dialog">
        <div class="confirm_dialog_icon">
            <svg viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v5M14 11v5"/>
            </svg>
        </div>
        <h3 id="confirm_dialog_title"></h3>
        <p id="confirm_dialog_message"></p>
        <div class="confirm_dialog_actions">
            <button type="button" class="confirm_dialog_button" data-no></button>
            <button type="button" class="confirm_dialog_button" data-yes></button>
        </div>
    </div>
`;

let element = null;
function createConfirmDialog()
{
    if (element)
        return element;

    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.append(style);

    element = document.createElement('div');
    element.className = 'confirm_dialog_modal';
    element.hidden = true;
    element.setAttribute('role', 'alertdialog');
    element.setAttribute('aria-modal', 'true');
    element.setAttribute('aria-labelledby', 'confirm_dialog_title');
    element.setAttribute('aria-describedby', 'confirm_dialog_message');
    element.innerHTML = HTML;
    document.body.append(element);

    return element;
}

export function showConfirmDialog({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false })
{
    console.log('showConfirmDialog()')

    const prev = document.activeElement;

    const dialog = createConfirmDialog();
    dialog.querySelector('#confirm_dialog_title').textContent = title || '';
    dialog.querySelector('#confirm_dialog_message').textContent = message || '';
    dialog.querySelector('.confirm_dialog_icon').hidden = !danger;
    dialog.hidden = false;

    const button_no = dialog.querySelector('[data-no]');
    button_no.textContent = cancelText;
    button_no.focus(); // safe default: Cancel

    const button_yes = dialog.querySelector('[data-yes]');
    button_yes.textContent = confirmText;
    button_yes.className = 'confirm_dialog_button ' + (danger ? 'danger' : 'primary');

    return new Promise(resolve => {
        const done = v => {
            dialog.hidden = true;
            prev && prev.focus && prev.focus();
            resolve(v);
        };

        button_yes.onclick = () => done(true);
        button_no.onclick = () => done(false);

        dialog.onclick = e => {
            if (e.target === dialog)
                done(false);
        };

        dialog.onkeydown = e => {
            if (e.key === 'Escape') {
                e.stopPropagation();
                done(false);
            }

            if (e.key === 'Tab') {
                e.preventDefault();
                (document.activeElement === button_no ? button_yes : button_no).focus();
            }
        };
    });
}

(function()
    {
        window.showConfirmDialog = function ({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', danger = false }) {
            return showConfirmDialog({ title, message, confirmText, cancelText, danger });
        }
    }
)();