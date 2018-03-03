import React from 'react'

const AddBlog = ({ handleSubmit, handleChange, newTitle, newAuthor, newUrl }) => {
    return (
        <div>
            <h2>add blog</h2>

            <form onSubmit={handleSubmit}>
                <div>
                title
                <input
                    value={newTitle}
                    onChange={handleChange}
                    name="newTitle"
                />
                </div>
                <div>
                author
                <input
                    value={newAuthor}
                    onChange={handleChange}
                    name="newAuthor"
                />
                </div>
                <div>
                url
                <input
                    value={newUrl}
                    onChange={handleChange}
                    name="newUrl"
                />
                </div>
                <button type="submit">add blog</button>
            </form>
        </div>
    )
}

export default AddBlog