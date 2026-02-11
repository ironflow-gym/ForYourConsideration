
import { AwardData } from './types';

/**
 * Definitive List for the 98th Academy Awards (2026)
 * As provided by the user.
 */
export const LATEST_VERIFIED_AWARDS: AwardData = {
  id: 'oscars-2026-definitive',
  name: '98th Academy Awards',
  year: 2026,
  announced: false,
  status: 'contender',
  dataFound: true,
  lastUpdated: Date.now(),
  sources: [{ title: 'Provided Definitive Contender List', uri: '#' }],
  categories: [
    {
      id: 'cat-pic',
      name: 'Best Picture',
      nominees: [
        { id: 'nom-pic-0', movieTitle: 'Bugonia', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-1', movieTitle: 'F1', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-2', movieTitle: 'Frankenstein', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-3', movieTitle: 'Hamnet', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-4', movieTitle: 'Marty Supreme', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-5', movieTitle: 'One Battle after Another', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-6', movieTitle: 'The Secret Agent', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-7', movieTitle: 'Sentimental Value', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-8', movieTitle: 'Sinners', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pic-9', movieTitle: 'Train Dreams', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-dir',
      name: 'Directing',
      nominees: [
        { id: 'nom-dir-0', movieTitle: 'Hamnet', individualName: 'Chloé Zhao', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-dir-1', movieTitle: 'Marty Supreme', individualName: 'Josh Safdie', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-dir-2', movieTitle: 'One Battle after Another', individualName: 'Paul Thomas Anderson', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-dir-3', movieTitle: 'Sentimental Value', individualName: 'Joachim Trier', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-dir-4', movieTitle: 'Sinners', individualName: 'Ryan Coogler', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-actor-lead',
      name: 'Actor in a Leading Role',
      nominees: [
        { id: 'nom-al-0', movieTitle: 'Marty Supreme', individualName: 'Timothée Chalamet', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-al-1', movieTitle: 'One Battle after Another', individualName: 'Leonardo DiCaprio', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-al-2', movieTitle: 'Blue Moon', individualName: 'Ethan Hawke', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-al-3', movieTitle: 'Sinners', individualName: 'Michael B. Jordan', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-al-4', movieTitle: 'The Secret Agent', individualName: 'Wagner Moura', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-actress-lead',
      name: 'Actress in a Leading Role',
      nominees: [
        { id: 'nom-asl-0', movieTitle: 'Hamnet', individualName: 'Jessie Buckley', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asl-1', movieTitle: "If I Had Legs I'd Kick You", individualName: 'Rose Byrne', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asl-2', movieTitle: 'Song Sung Blue', individualName: 'Kate Hudson', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asl-3', movieTitle: 'Sentimental Value', individualName: 'Renate Reinsve', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asl-4', movieTitle: 'Bugonia', individualName: 'Emma Stone', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-actor-supp',
      name: 'Actor in a Supporting Role',
      nominees: [
        { id: 'nom-as-0', movieTitle: 'One Battle after Another', individualName: 'Benicio Del Toro', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-as-1', movieTitle: 'Frankenstein', individualName: 'Jacob Elordi', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-as-2', movieTitle: 'Sinners', individualName: 'Delroy Lindo', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-as-3', movieTitle: 'One Battle after Another', individualName: 'Sean Penn', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-as-4', movieTitle: 'Sentimental Value', individualName: 'Stellan Skarsgård', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-actress-supp',
      name: 'Actress in a Supporting Role',
      nominees: [
        { id: 'nom-ass-0', movieTitle: 'Sentimental Value', individualName: 'Elle Fanning', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ass-1', movieTitle: 'Sentimental Value', individualName: 'Inga Ibsdotter Lilleaas', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ass-2', movieTitle: 'Weapons', individualName: 'Amy Madigan', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ass-3', movieTitle: 'Sinners', individualName: 'Wunmi Mosaku', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ass-4', movieTitle: 'One Battle after Another', individualName: 'Teyana Taylor', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-ani-feat',
      name: 'Animated Feature Film',
      nominees: [
        { id: 'nom-af-0', movieTitle: 'Arco', individualName: 'Ugo Bienvenu, Félix de Givry, Sophie Mas and Natalie Portman', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-af-1', movieTitle: 'Elio', individualName: 'Madeline Sharafian, Domee Shi, Adrian Molina and Mary Alice Drumm', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-af-2', movieTitle: 'KPop Demon Hunters', individualName: 'Maggie Kang, Chris Appelhans and Michelle L.M. Wong', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-af-3', movieTitle: 'Little Amélie or the Character of Rain', individualName: 'Maïlys Vallade, Liane-Cho Han, Nidia Santiago and Henri Magalon', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-af-4', movieTitle: 'Zootopia 2', individualName: 'Jared Bush, Byron Howard and Yvett Merino', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-ani-short',
      name: 'Animated Short Film',
      nominees: [
        { id: 'nom-asf-0', movieTitle: 'Butterfly', individualName: 'Florence Miailhe and Ron Dyens', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asf-1', movieTitle: 'Forevergreen', individualName: 'Nathan Engelhardt and Jeremy Spears', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asf-2', movieTitle: 'The Girl Who Cried Pearls', individualName: 'Chris Lavis and Maciek Szczerbowski', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asf-3', movieTitle: 'Retirement Plan', individualName: 'John Kelly and Andrew Freedman', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-asf-4', movieTitle: 'The Three Sisters', individualName: 'Konstantin Bronzit', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-casting',
      name: 'Casting',
      nominees: [
        { id: 'nom-cas-0', movieTitle: 'Hamnet', individualName: 'Nina Gold', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cas-1', movieTitle: 'Marty Supreme', individualName: 'Jennifer Venditti', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cas-2', movieTitle: 'One Battle after Another', individualName: 'Cassandra Kulukundis', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cas-3', movieTitle: 'The Secret Agent', individualName: 'Gabriel Domingues', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cas-4', movieTitle: 'Sinners', individualName: 'Francine Maisler', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-cinematography',
      name: 'Cinematography',
      nominees: [
        { id: 'nom-cine-0', movieTitle: 'Frankenstein', individualName: 'Dan Laustsen', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cine-1', movieTitle: 'Marty Supreme', individualName: 'Darius Khondji', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cine-2', movieTitle: 'One Battle after Another', individualName: 'Michael Bauman', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cine-3', movieTitle: 'Sinners', individualName: 'Autumn Durald Arkapaw', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cine-4', movieTitle: 'Train Dreams', individualName: 'Adolpho Veloso', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-costume',
      name: 'Costume Design',
      nominees: [
        { id: 'nom-cos-0', movieTitle: 'Avatar: Fire and Ash', individualName: 'Deborah L. Scott', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cos-1', movieTitle: 'Frankenstein', individualName: 'Kate Hawley', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cos-2', movieTitle: 'Hamnet', individualName: 'Malgosia Turzanska', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cos-3', movieTitle: 'Marty Supreme', individualName: 'Miyako Bellizzi', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-cos-4', movieTitle: 'Sinners', individualName: 'Ruth E. Carter', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-doc-feat',
      name: 'Documentary Feature Film',
      nominees: [
        { id: 'nom-df-0', movieTitle: 'The Alabama Solution', individualName: 'Andrew Jarecki and Charlotte Kaufman', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-df-1', movieTitle: 'Come See Me in the Good Light', individualName: 'Ryan White, Jessica Hargrave, Tig Notaro and Stef Willen', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-df-2', movieTitle: 'Cutting through Rocks', individualName: 'Sara Khaki and Mohammadreza Eyni', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-df-3', movieTitle: 'Mr. Nobody against Putin', individualName: 'David Borenstein, Pavel Talankin, Helle Faber and Alžběta Karásková', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-df-4', movieTitle: 'The Perfect Neighbor', individualName: 'Geeta Gandbhir, Alisa Payne, Nikon Kwantu and Sam Bisbee', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-doc-short',
      name: 'Documentary Short Film',
      nominees: [
        { id: 'nom-ds-0', movieTitle: 'All the Empty Rooms', individualName: 'Joshua Seftel and Conall Jones', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ds-1', movieTitle: 'Armed Only with a Camera: The Life and Death of Brent Renaud', individualName: 'Craig Renaud and Juan Arredondo', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ds-2', movieTitle: 'Children No More: "Were and Are Gone"', individualName: 'Hilla Medalia and Sheila Nevins', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ds-3', movieTitle: 'The Devil Is Busy', individualName: 'Christalyn Hampton and Geeta Gandbhir', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ds-4', movieTitle: 'Perfectly a Strangeness', individualName: 'Alison McAlpine', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-edit',
      name: 'Film Editing',
      nominees: [
        { id: 'nom-fe-0', movieTitle: 'F1', individualName: 'Stephen Mirrione', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-fe-1', movieTitle: 'Marty Supreme', individualName: 'Ronald Bronstein and Josh Safdie', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-fe-2', movieTitle: 'One Battle after Another', individualName: 'Andy Jurgensen', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-fe-3', movieTitle: 'Sentimental Value', individualName: 'Olivier Bugge Coutté', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-fe-4', movieTitle: 'Sinners', individualName: 'Michael P. Shawver', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-intl',
      name: 'International Feature Film',
      nominees: [
        { id: 'nom-if-0', movieTitle: 'The Secret Agent', individualName: 'Brazil', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-if-1', movieTitle: 'It Was Just an Accident', individualName: 'France', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-if-2', movieTitle: 'Sentimental Value', individualName: 'Norway', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-if-3', movieTitle: 'Sirāt', individualName: 'Spain', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-if-4', movieTitle: 'The Voice of Hind Rajab', individualName: 'Tunisia', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-live-short',
      name: 'Live Action Short Film',
      nominees: [
        { id: 'nom-las-0', movieTitle: "Butcher's Stain", individualName: 'Meyer Levinson-Blount and Oron Caspi', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-las-1', movieTitle: 'A Friend of Dorothy', individualName: 'Lee Knight and James Dean', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-las-2', movieTitle: "Jane Austen's Period Drama", individualName: 'Julia Aks and Steve Pinder', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-las-3', movieTitle: 'The Singers', individualName: 'Sam A. Davis and Jack Piatt', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-las-4', movieTitle: 'Two People Exchanging Saliva', individualName: 'Alexandre Singh and Natalie Musteata', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-makeup',
      name: 'Makeup and Hairstyling',
      nominees: [
        { id: 'nom-mh-0', movieTitle: 'Frankenstein', individualName: 'Mike Hill, Jordan Samuel and Cliona Furey', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-mh-1', movieTitle: 'Kokuho', individualName: 'Kyoko Toyokawa, Naomi Hibino and Tadashi Nishimatsu', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-mh-2', movieTitle: 'Sinners', individualName: 'Ken Diaz, Mike Fontaine and Shunika Terry', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-mh-3', movieTitle: 'The Smashing Machine', individualName: 'Kazu Hiro, Glen Griffin and Bjoern Rehbein', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-mh-4', movieTitle: 'The Ugly Stepsister', individualName: 'Thomas Foldberg and Anne Cathrine Sauerberg', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-score',
      name: 'Music (Original Score)',
      nominees: [
        { id: 'nom-ms-0', movieTitle: 'Bugonia', individualName: 'Jerskin Fendrix', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ms-1', movieTitle: 'Frankenstein', individualName: 'Alexandre Desplat', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ms-2', movieTitle: 'Hamnet', individualName: 'Max Richter', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ms-3', movieTitle: 'One Battle after Another', individualName: 'Jonny Greenwood', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-ms-4', movieTitle: 'Sinners', individualName: 'Ludwig Goransson', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-song',
      name: 'Music (Original Song)',
      nominees: [
        { id: 'nom-os-0', movieTitle: 'Diane Warren: Relentless', individualName: 'Dear Me; Music and Lyric by Diane Warren', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-os-1', movieTitle: 'KPop Demon Hunters', individualName: 'Golden; Music and Lyric by EJAE, Mark Sonnenblick, Joong Gyu Kwak, Yu Han Lee, Hee Dong Nam, Jeong Hoon Seo and Teddy Park', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-os-2', movieTitle: 'Sinners', individualName: 'I Lied To You; Music and Lyric by Raphael Saadiq and Ludwig Goransson', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-os-3', movieTitle: 'Viva Verdi!', individualName: 'Sweet Dreams Of Joy; Music and Lyric by Nicholas Pike', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-os-4', movieTitle: 'Train Dreams', individualName: 'Train Dreams; Music by Nick Cave and Bryce Dessner; Lyric by Nick Cave', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-prod',
      name: 'Production Design',
      nominees: [
        { id: 'nom-pd-0', movieTitle: 'Frankenstein', individualName: 'Production Design: Tamara Deverell; Set Decoration: Shane Vieau', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pd-1', movieTitle: 'Hamnet', individualName: 'Production Design: Fiona Crombie; Set Decoration: Alice Felton', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pd-2', movieTitle: 'Marty Supreme', individualName: 'Production Design: Jack Fisk; Set Decoration: Adam Willis', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pd-3', movieTitle: 'One Battle after Another', individualName: 'Production Design: Florencia Martin; Set Decoration: Anthony Carlino', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-pd-4', movieTitle: 'Sinners', individualName: 'Production Design: Hannah Beachler; Set Decoration: Monique Champagne', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-sound',
      name: 'Sound',
      nominees: [
        { id: 'nom-sou-0', movieTitle: 'F1', individualName: 'Gareth John, Al Nelson, Gwendolyn Yates Whittle, Gary A. Rizzo and Juan Peralta', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-sou-1', movieTitle: 'Frankenstein', individualName: 'Greg Chapman, Nathan Robitaille, Nelson Ferreira, Christian Cooke and Brad Zoern', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-sou-2', movieTitle: 'One Battle after Another', individualName: 'José Antonio García, Christopher Scarabosio and Tony Villaflor', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-sou-3', movieTitle: 'Sinners', individualName: 'Chris Welcker, Benjamin A. Burtt, Felipe Pacheco, Brandon Proctor and Steve Boeddeker', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-sou-4', movieTitle: 'Sirāt', individualName: 'Amanda Villavieja, Laia Casanovas and Yasmina Praderas', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-vfx',
      name: 'Visual Effects',
      nominees: [
        { id: 'nom-vfx-0', movieTitle: 'Avatar: Fire and Ash', individualName: 'Joe Letteri, Richard Baneham, Eric Saindon and Daniel Barrett', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-vfx-1', movieTitle: 'F1', individualName: 'Ryan Tudhope, Nicolas Chevallier, Robert Harrington and Keith Dawson', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-vfx-2', movieTitle: 'Jurassic World Rebirth', individualName: 'David Vickery, Stephen Aplin, Charmaine Chan and Neil Corbould', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-vfx-3', movieTitle: 'The Lost Bus', individualName: 'Charlie Noble, David Zaretti, Russell Bowen and Brandon K. McLaughlin', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-vfx-4', movieTitle: 'Sinners', individualName: 'Michael Ralla, Espen Nordahl, Guido Wolter and Donnie Dean', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-writ-adapt',
      name: 'Writing (Adapted Screenplay)',
      nominees: [
        { id: 'nom-wa-0', movieTitle: 'Bugonia', individualName: 'Screenplay by Will Tracy', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wa-1', movieTitle: 'Frankenstein', individualName: 'Written for the Screen by Guillermo del Toro', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wa-2', movieTitle: 'Hamnet', individualName: 'Screenplay by Chloé Zhao & Maggie O\'Farrell', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wa-3', movieTitle: 'One Battle after Another', individualName: 'Written by Paul Thomas Anderson', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wa-4', movieTitle: 'Train Dreams', individualName: 'Screenplay by Clint Bentley & Greg Kwedar', isWinner: false, predictionRank: 0, seen: false }
      ]
    },
    {
      id: 'cat-writ-orig',
      name: 'Writing (Original Screenplay)',
      nominees: [
        { id: 'nom-wo-0', movieTitle: 'Blue Moon', individualName: 'Written by Robert Kaplow', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wo-1', movieTitle: 'It Was Just an Accident', individualName: 'Written by Jafar Panahi; Script collaborators - Nader Saïvar, Shadmehr Rastin, Mehdi Mahmoudian', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wo-2', movieTitle: 'Marty Supreme', individualName: 'Written by Ronald Bronstein & Josh Safdie', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wo-3', movieTitle: 'Sentimental Value', individualName: 'Written by Eskil Vogt, Joachim Trier', isWinner: false, predictionRank: 0, seen: false },
        { id: 'nom-wo-4', movieTitle: 'Sinners', individualName: 'Written by Ryan Coogler', isWinner: false, predictionRank: 0, seen: false }
      ]
    }
  ]
};
