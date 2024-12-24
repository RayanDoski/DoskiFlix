import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from '../layout/Hero/hero.js';
import MovieSlider from '../layout/MovieSlide/movieSlide.js'
import Login from './popupLogin.js'

function App() {

    const comedyMovies = [
        'Superbad', 'Step Brothers', 'The Hangover', 'Bridesmaids', 'Tropic Thunder',
        'Anchorman', 'Dumb and Dumber', '21 Jump Street', 'Game Night', 'The Other Guys',
        'Wedding Crashers', 'Mean Girls', 'The 40-Year-Old Virgin', 'Napoleon Dynamite',
        'Shaun of the Dead', 'Zombieland', 'Borat', 'Austin Powers', 'Elf', 'Deadpool',
        'Pineapple Express', 'Hot Fuzz', 'Crazy, Stupid, Love', 'Pitch Perfect', 'Talladega Nights',
        'Super Troopers', 'Kung Fu Hustle', 'Bad Moms', 'Horrible Bosses', 'Trainwreck',
        'Meet the Parents', 'School of Rock', 'Legally Blonde', 'The Grand Budapest Hotel',
        'Harold & Kumar Go to White Castle', 'Knocked Up', 'Little Miss Sunshine',
        'Juno', 'Scott Pilgrim vs. The World', 'The Big Lebowski', 'Forgetting Sarah Marshall',
        'Clueless', 'Groundhog Day', 'Planes, Trains & Automobiles', 'The Truman Show',
        'Ferris Bueller’s Day Off', 'Ghostbusters', 'Coming to America', 'Rush Hour', 'Big',
        'Office Space', 'Home Alone', 'Beverly Hills Cop', 'Mrs. Doubtfire', 'Happy Gilmore',
        'Billy Madison', 'Blades of Glory', 'The Pink Panther', 'Spy', 'Get Smart',
        'Central Intelligence', 'The Dictator', 'The Heat', 'Shallow Hal', 'My Big Fat Greek Wedding',
        'Yes Man', 'Bruce Almighty', 'Liar Liar', 'The Mask', 'Ace Ventura: Pet Detective',
        'Kick-Ass', 'Kingsman: The Secret Service', 'Johnny English', 'Night at the Museum',
        'Paul', 'The Lego Movie', 'Madagascar', 'Despicable Me', 'Shrek', 'Monsters, Inc.',
        'Finding Nemo', 'Toy Story', 'Up', 'Inside Out', 'Coco', 'Zootopia', 'Ice Age',
        'Hotel Transylvania', 'Kung Fu Panda', 'The Croods', 'Ratatouille', 'Minions',
        'The Secret Life of Pets', 'Sing', 'Megamind', 'The Boss Baby', 'The Simpsons Movie'
    ];

    const actionMovies = [
        'Die Hard', 'Mad Max: Fury Road', 'John Wick', 'The Dark Knight', 'Gladiator',
        'The Matrix', 'The Bourne Identity', 'The Avengers', 'Iron Man', 'Spider-Man',
        'Black Panther', 'Wonder Woman', 'Captain America: The Winter Soldier', 'Thor: Ragnarok',
        'Logan', 'Deadpool', 'X-Men: Days of Future Past', 'Inception', 'Django Unchained',
        'The Equalizer', 'Atomic Blonde', 'Skyfall', 'Casino Royale', 'Mission: Impossible – Fallout',
        'Edge of Tomorrow', '300', 'The Expendables', 'Fast & Furious', 'Hobbs & Shaw',
        'Transformers', 'Pacific Rim', 'Taken', 'War of the Worlds', 'Independence Day',
        'The Hunger Games', 'Divergent', 'The Maze Runner', 'The Hobbit', 'The Lord of the Rings',
        'The Twilight Saga', 'Harry Potter', 'Fantastic Beasts', 'Doctor Strange', 'Ant-Man',
        'Guardians of the Galaxy', 'The Incredible Hulk', 'Justice League', 'Suicide Squad',
        'The Batman', 'Shazam!', 'Aquaman', 'Venom', 'The Punisher', 'The Crow', 'Robocop',
        'Terminator 2: Judgment Day', 'Predator', 'Rambo', 'Cliffhanger', 'Escape Plan'
    ];

    const dramaMovies = [
        'Forrest Gump', 'The Shawshank Redemption', 'The Godfather', 'The Green Mile', 'Titanic',
        'A Beautiful Mind', 'Schindler’s List', 'The Pursuit of Happyness', 'Good Will Hunting',
        'The Social Network', '12 Years a Slave', 'The Help', 'Million Dollar Baby', 'The King’s Speech',
        'The Imitation Game', 'Dallas Buyers Club', 'Spotlight', 'The Theory of Everything', 
        'The Revenant', 'There Will Be Blood', 'Birdman', 'The Pianist', 'The Great Gatsby',
        'Slumdog Millionaire', 'American Beauty', 'The Curious Case of Benjamin Button',
        'The Wolf of Wall Street', 'Whiplash', 'Black Swan', 'La La Land', 'The Departed', 'Requiem for a Dream',
        'Fight Club', 'Se7en', 'The Truman Show', 'Life of Pi', 'Cast Away', 'The Grand Budapest Hotel',
        'Her', 'Moonlight', 'Manchester by the Sea', 'The Shape of Water', 'Joker'
    ];
      
    const sciFiMovies = [
        'Blade Runner', 'Interstellar', 'The Martian', 'Gravity', 'Arrival', 'Inception', 'Dune',
        'Star Wars: A New Hope', 'The Empire Strikes Back', 'Return of the Jedi', 'The Force Awakens',
        'Rogue One', 'Solo', 'The Matrix', 'Matrix Reloaded', 'The Matrix Revolutions', 'Tron',
        'War of the Worlds', 'ET', 'Close Encounters of the Third Kind', 'District 9', 'Avatar',
        'Ready Player One', 'Ex Machina', 'Annihilation', 'Prometheus', 'Alien', 'Aliens',
        'Star Trek', 'Star Trek Into Darkness', 'Star Trek Beyond', 'The Fifth Element', 'Minority Report',
        'I Am Legend', 'Oblivion', 'Edge of Tomorrow', 'Ender’s Game', 'Pacific Rim', 'Terminator 2',
        'Terminator: Dark Fate', 'Looper', 'Children of Men', 'A Quiet Place', 'The Host'
    ];

  return (
    <>
        <Hero/>
        {/* <MovieSlider Title="Comedy" movies={comedyMovies} />
        <MovieSlider Title="Action" movies={actionMovies} />
        <MovieSlider Title="Drama" movies={dramaMovies} />
        <MovieSlider Title="SciFi" movies={sciFiMovies} /> */}
    </>
  );
}

export default App;
