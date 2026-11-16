import Profile2 from './Profile';
import Congratulations from './Congratulations';
import TodoList from './ToDoList';
import Gallery from './Gallery';

export default function Profile() {

  return (
    <>
      <img
        src="https://i.imgur.com/lICfvbD.jpg"
        alt="Aklilu Lemma"
      />
      {/* Użycie zaimportowanego komponentu */}
      <Profile2 /> 
      {/* Użycie zaimportowanego komponentu */}
      <Congratulations /> 
      {/* Użycie zaimportowanego komponentu */}
      <TodoList /> 
      {/* Użycie zaimportowanego komponentu */}
      <Gallery /> 
    </>
  );
}




