import { select } from './utils.js'
import { set_cards_listeners, card_update_ui } from './cards.js'
import { db_get_cards_by_chapter, db_flush } from './db.js'
import { chapter_template, get_card_in_chapter_by_id } from './chapters.js'
import { show_modal } from './modal.js'

function update_ui_state(chapter_title) {
    db_get_cards_by_chapter(chapter_title).forEach(card => {
        const html_card = get_card_in_chapter_by_id(chapter_title, card.id, 'card-id')
        card_update_ui(html_card, card.is_task_completed, card.is_favorite)
    })
}

/**
 * @brief Set listeners to the control buttons
 */
function set_listeners_controls() {
    /* New entry button */
    const new_entry_btn = select('#btn-new-entry')
    new_entry_btn.addEventListener('click', () => {
        show_modal({
            id: 'new-entry-modal',
            type: 'modal-info',
            icon: 'bi bi-plus',
            title: 'Nuevo material',
            body: `
                <p> Ingrese los datos del nuevo material </p>
                <form id="new-entry-form">
                    <input type="text" class="form-control" id="new-entry-title" placeholder="Título">
                    <input type="text" class="form-control" id="new-entry-description" placeholder="Descripción">
                    <input type="text" class="form-control" id="new-entry-url" placeholder="URL">
                </form>
                `,
            buttons: [
                {
                    id: 'btn-new-entry-save',
                    type: 'btn-modal-success',
                    text: 'Agregar',
                    action: () => {
                        const title = select('#new-entry-title').value
                        const description = select('#new-entry-description').value
                        const url = select('#new-entry-url').value
                        if (title == '' || description == '' || url == '') {
                            show_modal({
                                id: 'new-entry-modal-empty-fields',
                                type: 'modal-danger',
                                icon: 'bi bi-exclamation',
                                title: 'Error',
                                body: 'Debe completar todos los campos',
                            })
                            return
                        }

                        alert('En construcción. ¡Gracias por entender!')
                    }
                }
            ],
        })
    })

    /* Filter favorite cards button */
    const fav_btn = select('#btn-filter-favs')
    fav_btn.addEventListener('click', () => {
        fav_btn.classList.toggle('bg-light')
        fav_btn.classList.toggle('text-dark')

        select('[favorite="false"]', true)
            .filter(card => card.getAttribute('favorite') == 'false')
            .map(card => card.parentElement.classList.toggle('d-none'))
    })

    const completed_cards_btn = select('#btn-filter-completed-tasks')
    const uncompleted_cards_btn = select('#btn-filter-uncompleted-tasks')

    /* Filter completed cards button */
    completed_cards_btn.addEventListener('click', () => {
        completed_cards_btn.classList.toggle('bg-light')
        completed_cards_btn.classList.toggle('text-dark')
        uncompleted_cards_btn.toggleAttribute('disabled')

        select('[task-completed="false"]', true)
            .filter(card => card.getAttribute('task-completed') == 'false')
            .map(card => card.parentElement.classList.toggle('d-none'))
    })

    /* Filter uncompleted cards button */
    uncompleted_cards_btn.addEventListener('click', () => {
        uncompleted_cards_btn.classList.toggle('bg-light')
        uncompleted_cards_btn.classList.toggle('text-dark')
        completed_cards_btn.toggleAttribute('disabled')

        select('[task-completed="true"]', true)
            .filter(card => card.getAttribute('task-completed') == 'true')
            .map(card => card.parentElement.classList.toggle('d-none'))
    })

    /* Delete all progress button */
    select('#btn-delete-all-entries').addEventListener('click', () => {
        show_modal({
            id: 'delete-all-entries-modal',
            type: 'modal-danger',
            icon: 'bi bi-x',
            title: 'Eliminar todo el progreso',
            body: `
         <p> ¿Está seguro de eliminar todo el progreso? </p>
         `,
            buttons: [
                {
                    id: 'btn-delete-all-entries-confirm',
                    type: 'btn-modal-danger',
                    text: 'Eliminar',
                    action: () => {
                        db_flush()
                        location.reload() //FIXME: I think this is not the best way to do this
                    }
                }
            ],
        })
    })
}

/**
 * @brief Get cards data from JSON DB (Local file) and add it to the DOM
 */
function load_content(DB, cards_container_id, error_callback) {

    set_listeners_controls()

    const cards_container = select(cards_container_id)
    fetch(DB)
        .then(response => response.json())
        .then(data => {
            data.chapters.forEach((card_data) => {
                cards_container.innerHTML += chapter_template(card_data)
                update_ui_state(card_data.chapter_title)
            })
            set_cards_listeners(update_ui_state)
            error_callback(true)
        })
        .catch(error => {

            console.error(error)

            show_modal({
                id: 'error-modal',
                body: 'Ocurrió un error al cargar los datos de la materia.<br>Si el problema persiste, por favor contacte al administrador.',
                buttons: [
                    {
                        type: 'btn-modal-info',
                        text: 'Reintentar',
                        action: () => {
                            location.reload()
                        }
                    }
                ]
            })

            error_callback(false)
        })
}


export { load_content }