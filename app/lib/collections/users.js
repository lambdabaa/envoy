Meteor.users.getName = function(userId) {
  if (!userId) {
    return '';
  }

  var users = Meteor.users.find({ _id: userId }).fetch();
  var user = users[0];
  var profileName;
  try {
    profileName = user.profile.name;
  } catch (e) {
    profileName = '';
  }

  return profileName;
};
