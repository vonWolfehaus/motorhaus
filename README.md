This is a framework for prototyping games that I'm building for kicks.

I recommend going with [Unity3D](http://unity3d.com/) for a full engine.

## Architecture

If you're familiar with [Unity3D](http://unity3d.com/), you'll have an easier time understanding what's going on here. **The important point is that all the action happens in components.** Entities are merely the strings that tie together a set of components.

Both entities and components have `activate()` and `disable()`, but only components have `update()`. So if you want to do special game logic on every tick, then you need to make a new component, and probably give it a Signal or two that the entity listens for.

Communication between an entity and a component, and between components, is done through Signals, or simple properties. The most powerful aspect is components sharing references through entities. For example, most entities have a position (`Vec2`), so to ensure both the view and physics components stay in sync, they both simply reference their parent entity's position property--no work is needed from the entity itself.
