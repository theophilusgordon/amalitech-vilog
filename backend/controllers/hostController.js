// @desc: Get A User
// @route: GET /api/users/user
// @access: Private
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json(user);
});
