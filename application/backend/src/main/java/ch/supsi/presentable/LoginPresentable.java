package ch.supsi.presentable;

import ch.supsi.model.login.Login;

public class LoginPresentable extends UnecePresentable<Login> {

    public LoginPresentable(Login object) {
        super(object);
    }

    public String getUsername() {
        return this.presentable.getUsername();
    }

    public UserPresentable getUser() {
        return new UserPresentable(this.presentable.getUser());
    }
}
