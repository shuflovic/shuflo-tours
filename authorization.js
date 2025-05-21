async function signUp(email, password) {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) {
    alert(error.message);
  } else {
    alert('Check your email for a confirmation link!');
  }
}

async function signIn(email, password) {
  const { user, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    alert(error.message);
  } else {
    alert('Signed in!');
  }
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert(error.message);
  } else {
    alert('Signed out!');
  }
}
