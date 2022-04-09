import { select } from './utils.js'
import { db_update_card } from './db.js'

/**
 * @brief  Template for cards (HTML)
 * @param {*} data
 * @returns HTML Card Template.
 */
function card_template(data, id, chapter) {
    const type = data.type == "" ? "-" : data.type

    let type_icon = undefined
    if (type == "video" || type == "v") type_icon = "bi bi-video"
    else if (type == "pdf" || type == "p") type_icon = "bi bi-file-pdf"
    else type_icon = "bi bi-file-alt"

    const description = data.description == "" ? "Sin descripción" : data.description
    const url = data.url == "" ? "#" : data.url

    const html = `
        <div class="card mt-4" card-id="card-${id}" asociated-chapter-card="${chapter}" favorite="false" task-completed="false">
            <div class="card-body">
                <div class="d-flex justify-content-between">
                    <h5 class="card-title" id="title_${id}">${type} <i class="${type_icon}"></i></h5>
                    <i class="fav-btn bi bi-star fs-5" id="fav-${id}" asociated-chapter-card="${chapter}"></i>
                </div>
                <p class="card-text text-truncate" id="description_${id}">${description}</p>
            </div>
            <div class="card-footer d-flex align-items-center justify-content-between">
                <a href="${url}" class="btn btn-outline-warning" id="watch_button_${id}" target="_blank" rel="noreferrer noopener">Ver</a>
                <button class="check-button" id="button-${id}" asociated-chapter-card="${chapter}">
                    <i class="bi bi-x" id="button-${id}"></i>
                </button>
            </div>
        </div>
        `
    return html
}

function card_state_task_btn_event(html_card, is_task_completed) {

    const state = is_task_completed == undefined ? html_card.getAttribute('task-completed') == 'false' : is_task_completed
    const btn = html_card.querySelector('.check-button')
    const btn_icon = btn.querySelector('i')

    if (state) {
        html_card.setAttribute('task-completed', 'true')
        btn_icon.classList.add('bi-check')
        btn_icon.classList.remove('bi-x')
        btn.classList.add('task-completed')
        btn.classList.remove('task-uncompleted')
        html_card.style.backgroundColor = "#00ff87"
    } else {
        html_card.setAttribute('task-completed', 'false')
        btn_icon.classList.add('bi-x')
        btn_icon.classList.remove('bi-check')
        btn.classList.remove('task-completed')
        btn.classList.add('task-uncompleted')
        html_card.style.backgroundColor = "#ff004d"
    }

}

function card_state_fav_btn_event(html_card, is_favorite) {

    const fav_btn = html_card.querySelector('.fav-btn')
    const fav_state = is_favorite == undefined ? html_card.getAttribute('favorite') == 'false' : is_favorite
    if (fav_state) {
        html_card.setAttribute('favorite', 'true')
        fav_btn.classList.add('bi-star-fill')
        fav_btn.classList.remove('bi-star')
    }
    else {
        html_card.setAttribute('favorite', 'false')
        fav_btn.classList.add('bi-star')
        fav_btn.classList.remove('bi-star-fill')
    }

}

function cards_callback() {

    let parent_card = this.parentElement.parentElement

    const was_triggered_by_button = this.getAttribute('id').split('-')[0] == 'button'

    if (was_triggered_by_button)
        card_state_task_btn_event(parent_card)
    else{
        parent_card = this.parentElement.parentElement.parentElement
        card_state_fav_btn_event(parent_card)
    }

    const card = {
        chapter: parent_card.getAttribute('asociated-chapter-card'),
        id: parent_card.getAttribute('card-id'),
        is_task_completed: parent_card.getAttribute('task-completed') == 'true',
        is_favorite: parent_card.getAttribute('favorite') == 'true'
    }

    db_update_card(card)
}

function set_cards_listeners() {

    select('.check-button', true).forEach(button => {
        button.addEventListener('click', cards_callback)
    })

    select('.fav-btn', true).forEach(button => {
        button.addEventListener('click', cards_callback)
    })
}

/**
 * Wrapper for update card UI
 * @param {*} html_card
 * @param {*} is_task_completed
 * @param {*} is_favorite
 */
function card_update_ui(html_card, is_task_completed, is_favorite) {
    card_state_task_btn_event(html_card, is_task_completed)
    card_state_fav_btn_event(html_card, is_favorite)
}

export { card_template, set_cards_listeners, card_update_ui }