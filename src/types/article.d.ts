type Article = {
    id: number
    title: string
    desc: string
    cover: string
    content: string
    read: number
    like: number
    publish: number
    is_banner: number
    created_at: string
    published_at: string
    user_id: number
    category_id: number
    tags: Tag[]
    category: Category
}