import axios from 'axios'

// state
export const state = {
    blog: [],
    blogs: [],
    blog_categories: [],
}

// getters
export const getters = {
    blog: state => state.blog,
    blogs: state => state.blogs,
    blog_categories: state => state.blogs.blog_categories,
}

// mutations
export const mutations = {
    FETCH_BLOG(state, blog) {
        return state.blog = blog
    },
	CREATE_BLOG(state, blog) {
        state.blogs.unshift(blog)
    },
    FETCH_BLOGS(state, blogs) {
        return state.blogs = blogs
    },
    FETCH_BLOG_CATEGORIES(state, categories) {
        return state.blog_categories = categories
    },
    DELETE_BLOG(state, blog) {
        let index = state.blogs.findIndex(item => item.id == blog.id)
        // console.log(index)
        state.blogs.splice(index, 1)
	},
    UNPUBLISH_BLOG(state, blog) {
        state.blogs = state.blogs.map(b => {
            if (b.id === blog.id) {
              return Object.assign({}, b, blog)
            }
            return b
        })
	},
    PUBLISH_BLOG(state, blog) {
        state.blogs = state.blogs.map(b => {
            if (b.id === blog.id) {
              return Object.assign({}, b, blog)
            }
            return b
        })
	}
}

// actions
export const actions = {
    fetchBlog({commit}, blog) {
        axios.delete(`/api/blogs/${blog.slug}`)
            .then(res => {
                if (res.status === 200)
                    commit('FETCH_BLOG', res.data.blog)
            }).catch(err => {
                console.log(err)
            })
	},
	createBlog({commit}, blog) {
        axios.post('/api/admin/blogs', blog)
            .then(res => {
                commit('CREATE_BLOG', res.data)
            }).catch(err => {
                console.log(err)
            })
    },
    fetchBlogsAdmin({commit}) {
        axios.get('/api/admin/blogs')
            .then(r => r.data)
            .then(blogs => {
                commit('FETCH_BLOGS', blogs.blogs)
            })
    },
    fetchPublishedBlogs({commit}) {
        axios.get('/api/blogs')
            .then(r => r.data)
            .then(blogs => {
                commit('FETCH_BLOGS', blogs.blogs)
                commit('FETCH_BLOG_CATEGORIES', blogs.blog_categories)
            })
    },
    fetchBlogCategories({commit}) {
        axios.get('/api/blogs/categories')
            .then(r => r.data)
            .then(blogs => {
                commit('FETCH_BLOG_CATEGORIES', blogs.blog_categories)
            })
    },
    deleteBlog({commit}, blog) {
        axios.delete(`/api/admin/blogs/${blog.id}`)
            .then(res => {
                if (res.status === 204)
                    commit('DELETE_BLOG', blog)
            }).catch(err => {
                console.log(err)
            })
	},
    unpublishBlog({commit}, blog) {
        axios.patch('/api/admin/blogs/'+blog.id+'/unpublish')
            .then(res => {
                // console.log(res)
                if (res.status === 200)
                    commit('UNPUBLISH_BLOG', res.data)
            }).catch(err => {
                console.log(err)
            })
	},
    publishBlog({commit}, blog) {
        axios.patch('/api/admin/blogs/'+blog.id+'/publish')
            .then(res => {
                // console.log(res)
                if (res.status === 200)
                    commit('PUBLISH_BLOG', res.data)
            }).catch(err => {
                console.log(err)
            })
	}
}
