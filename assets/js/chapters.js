import { select } from './utils.js'
import { card_template } from './cards.js'

/**
 * @brief Template for subjects (HTML)
 * @param {*} data
 * @returns HTML Subject Template. Ready to be added to the DOM
*/
function chapter_template(data) {
    const html = `
    <div class="chapter-container">
        <div class="row">
            <div class="col-12">
                <h2 class="text-center py-2 chapter" asociated-chapter-h2="${data.chapter_title}">${data.chapter_title}</h2>
            </div>
        </div>
        <div class="row d-flex justify-content-center">
            ${data.cards_content
            .map((card, id) => card_template(card, id, data.chapter_title))
            .map(card =>
                `<div class="col-lg-3 col-md-6">${card}</div>`)
            .join('')
        }
        </div>
    </div>
    `
    return html
}

function get_cards_by_chapter(chapter_title) {
    return select(`[asociated-chapter-card="${chapter_title}"]`, true)
}

function get_card_in_chapter_by_id(chapter_title, id, attribute = 'id') {
    return get_cards_by_chapter(chapter_title).find(card => card.getAttribute(attribute) == id)
}

export { chapter_template, get_cards_by_chapter, get_card_in_chapter_by_id }