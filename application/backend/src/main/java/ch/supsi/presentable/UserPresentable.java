package ch.supsi.presentable;

import ch.supsi.model.User;

public class UserPresentable extends UnecePresentable<User> {

    public UserPresentable(User user){
        super(user);
    }

    public String getFirstName() { return this.presentable.getFirstname(); }

    public String getLastName() { return this.presentable.getLastname(); }

    public String getCity() {  return this.presentable.getCity(); }
}
