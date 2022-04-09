
function buttons_generator(buttons, modal_id) {
    let buttons_html = `<button type="button" class="btn-modal btn-modal-close" id="${modal_id}_close">Cerrar</button>`
    if (buttons)
        buttons_html += buttons.map(button => {
            return `
            <button type="button" class="btn-modal ${button.type}" id="${button.id}" onclick="${button.action}">
                ${button.text}
            </button>`
        }).join('')
    return buttons_html
}

function show_modal(modal) {

    // Disable scroll
    document.documentElement.style.overflow = 'hidden'

    // Defaults
    if (!modal.id) modal.id = 'modal_1'
    if (!modal.type) modal.type = 'modal-error'
    if (!modal.icon) modal.icon = 'bi bi-x'
    if (!modal.title) modal.title = 'Error'
    if (!modal.body) modal.body = 'Ocurrió un error'

    const modal_template = `
    <div class="modal-custom" id="${modal.id}">
        <div class="modal-custom-dialog ${modal.type}">
            <div class="icon-box">
                <i class="${modal.icon}"></i>
            </div>
            <div class="modal-custom-content">
                <div class="modal-custom-header"></div>
                <div class="modal-custom-body">
                    <h2>${modal.title}</h2>
                    ${modal.body}
                </div>
                <div class="modal-custom-footer">
                    ${buttons_generator(modal.buttons, modal.id)}
                </div>
            </div>
        </div>
    </div>
    `
    document.body.insertAdjacentHTML('beforeend', modal_template)
    document.querySelectorAll('.btn-modal-close').forEach(btn => btn.addEventListener('click', close_modal))
    if (modal.buttons)
        modal.buttons.forEach(button => {
            document.getElementById(button.id).addEventListener('click', button.action)
        })
    return document.getElementById(modal.id)
}

function close_modal() {
    // Enable scroll only if there are 1 modal (the base modal)
    if (document.querySelectorAll('.modal-custom').length == 1)
        document.documentElement.style.overflow = 'auto';
    document.querySelector(`#${this.id.split('_close')[0]}`).remove()
}

export { show_modal }