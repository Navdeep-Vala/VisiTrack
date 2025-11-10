import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { notifcations, unreadCount } = useAppSelector(
    (state) => state.notification
  );
  const [showNotifications, setShowNotifications] = useState(false);
};

export default Navbar;
