# [crts.io](https://crts.nishilanand.com)

## Summary

- Fast-paced racing game concept combined with combat elements.
- Vehicle and character customization.
- Real-time leaderboard

## About the project

- HTML, CSS, TypeScript (compiles to JavaScript)
- Graphics and physics made with HTML Canvas and TypeScript - no libraries
- Firebase tracks global fastest lap times

## To-do

- Fixes/basic improvements
  - ~~Health bar properly under orbs~~
  - ~~Respawning orbs~~
  - ~~Click to shoot~~
  - Balance vehicle/character stats
    - Some vehicles are faster than bullets
- Deceleration
  - Momentum
  - Braking
  - Drifting
- Implement real-time multiplayer
- Vehicle body damage
- More vehicles/characters
- Cosmetics, eg for reaching certain time/lap number milestones

## To-do - backend

- Code cleanup
- Vehicles, Characters, etc. should store their shape as a list of shapes instead of just one shape - allows for more appearance customization
  - Collision detection between players or players' vehicle instead of between players' shapes
- JSON to store stats
- Move some methods to helper file instead of just leaving them in main or wtv
