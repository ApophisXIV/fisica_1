
const db = localStorage // Reference to the localStorage

function db_get_cards_by_chapter(chapter) {
    // Check if the chapter exists
    if (db.getItem(chapter) == null)
        return []
    const chapter_data = JSON.parse(db.getItem(chapter))
    return chapter_data.cards
}

function db_update_card(card) {

    if (card.chapter == null || card.id == null || card.is_task_completed == null) {
        console.error('db_update_card: Missing parameters')
        return
    }

    // Check if the chapter exists
    if (db.getItem(card.chapter) == null) {
        db.setItem(card.chapter, JSON.stringify({
            chapter_title: card.chapter,
            cards: [
                {
                    id: card.id,
                    is_task_completed: card.is_task_completed,
                    is_favorite: card.is_favorite
                }
            ]
        }))
    } else {
        // Check if the card exists
        const chapter = JSON.parse(db.getItem(card.chapter))
        const card_index = chapter.cards.findIndex(card_finding => card_finding.id == card.id)
        if (card_index == -1) {
            chapter.cards.push({
                id: card.id,
                is_task_completed: card.is_task_completed,
                is_favorite: card.is_favorite
            })
        } else {
            chapter.cards[card_index].is_task_completed = card.is_task_completed
            chapter.cards[card_index].is_favorite = card.is_favorite
        }
        db.setItem(card.chapter, JSON.stringify(chapter))
    }

}

// Wrapper function to delete DB entries
function db_flush() {
    db.clear()
}

export { db_update_card, db_get_cards_by_chapter, db_flush }