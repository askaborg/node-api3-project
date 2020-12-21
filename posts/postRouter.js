const express = require("express")
const Posts = require("./postDb.js")

const router = express.Router({mergeParams: true})

router.get("/", (req, res) => {
  // do your magic!
  const { id } = req.params;
  Posts.get()
  .then( resp => {
    const userPosts = resp.filter( post => {
      return Number(post.user_id) === Number(id)
    })
    res.status(200).json(userPosts)
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error grabbing posts."
    })
  })
})

router.get("/:postId", validatePostId, (req, res) => {
  // do your magic!
  const { postId } = req.params;
  Posts.getById(postId)
  .then( resp => {
    res.status(200).json(resp);
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error fetching post information."
    })
  })
})

router.post('/', (req, res) => {
  Posts.insert(req.body)
  .then( resp => {
    res.status(201).json(resp)
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error creating the post."
    })
  })
})

router.delete("/:postId", validatePostId, (req, res) => {
  // do your magic!
  const { postId } = req.params
  Posts.remove(postId)
  .then( resp => {
    res.status(200).json({message: "post deleted"})
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error deleting the post."
    })
  })
})

router.put("/:postId", validatePostId, (req, res) => {
  // do your magic!
  const { postId } = req.params
  Posts.update(postId, req.body)
  .then( resp => {
    res.status(200).json({
      id: postId, text: req.body.text, user_id: req.body.user_id
    })
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "There was an error updating the post."
    })
  })
})

// custom middleware
function validatePostId(req, res, next) {
  // do your magic!
  const { postId } = req.params
  Posts.getById(postId)
  .then( resp => {
    next()
  })
  .catch( err => {
    res.status(500).json({
      errorMessage: "The specifed post does not exist."
    })
  })
}

module.exports = router
