class Users {
  constructor() {
    this.users = [
      {
        id: "9C7qnbt2PRdViFfuAAZl",
        userName: "Everybody",
        chatRoom: "",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnuK0JFLpqKTPuMg8VekcxeMEnx4REV71fuFxql2mc29Uv1fpwFzQt7LhID5-jBQekmWs&usqp=CAU",
      },
    ];
  }

  setChatRoomToDummyUser(chatRoom) {
    let user = this.getUser("9C7qnbt2PRdViFfuAAZl");
    user.chatRoom = chatRoom;
    return this.users;
  }

  setUser(id, userName, chatRoom) {
    let user = { id, userName, chatRoom };
    this.users.push(user);
    return this.users;
  }

  getUser(id) {
    let user = this.users.filter((user) => user.id === id)[0];
    return user;
  }

  getUsers() {
    return this.users;
  }

  getUsersByRoom(chatRoom) {
    let usersInRoom = this.users.filter((user) => user.chatRoom === chatRoom);
    return usersInRoom;
  }

  deleteUser(id) {
    let deletedUser = this.getUser(id);
    this.users = this.users.filter((user) => user.id != id);
    return deletedUser;
  }
}

export default Users;
