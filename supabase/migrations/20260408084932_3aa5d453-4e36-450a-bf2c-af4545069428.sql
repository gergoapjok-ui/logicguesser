-- Recreate the friendship notification trigger
DROP TRIGGER IF EXISTS friendship_notifications_trigger ON public.friendships;
CREATE TRIGGER friendship_notifications_trigger
  AFTER INSERT OR UPDATE ON public.friendships
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_friendship_notification();

-- Recreate the message notification trigger
DROP TRIGGER IF EXISTS message_notifications_trigger ON public.messages;
CREATE TRIGGER message_notifications_trigger
  AFTER INSERT ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_message_notification();

-- Recreate the credit notification trigger
DROP TRIGGER IF EXISTS credit_notifications_trigger ON public.profiles;
CREATE TRIGGER credit_notifications_trigger
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_credit_notification();