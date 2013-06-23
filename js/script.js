/* 
 * Based on the example provided with box2dweb release.
 */

function init() {
	var world;
	var scale;
	var canvasWidth;
	var canvasHeight;
	var bodies = new Array();

	scale = 1;
	canvasWidth = document.getElementById("canvas").width;
	canvasHeight = document.getElementById("canvas").height;

	var	b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    world = new b2World(
				new b2Vec2(0, 0)    //gravity
				, true               //allow sleep
    );

	/* fixture = shape + rigid body */
	var fixDef = new b2FixtureDef;
	fixDef.density = 0.0001; 		// 0 = mass is very small
	fixDef.friction = 0;		// 0 = no friction, 1 = strong friction
	fixDef.restitution = 1; 	// bounce, elasticity: 0 = no bounce, 1 = full bounce

	/*
	 * Create shapes
	 */

	/* use this for static, non-moving bodies */
	var bodyDef = new b2BodyDef;
	 
	/* create ground */
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = canvasWidth / 2 / scale;
	bodyDef.position.y = canvasHeight / scale;	
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox((canvasWidth / 2) / scale, 10);
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/* create ceiling */
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = canvasWidth / 2 / scale;
	bodyDef.position.y = 0;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox((canvasWidth / 2) / scale, 10);
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/* create left wall */
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = 0;
	bodyDef.position.y = canvasHeight / 2 / scale;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(10, ((canvasHeight / 2) / scale));
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/* create right wall */
	bodyDef.type = b2Body.b2_staticBody;
	bodyDef.position.x = canvasWidth / scale;
	bodyDef.position.y = canvasHeight / 2 / scale;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(10, ((canvasHeight / 2) / scale));
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/* create ball */
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = canvasWidth / 2 / scale;
	bodyDef.position.y = canvasHeight / 2 / scale;
	fixDef.shape = new b2CircleShape;
	fixDef.shape.SetRadius(15);
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/* create another ball */
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = canvasWidth / 3 / scale;
	bodyDef.position.y = canvasHeight / 2 / scale;
	fixDef.shape = new b2CircleShape;
	fixDef.shape.SetRadius(15);
	bodies.push(world.CreateBody(bodyDef));
	bodies[bodies.length-1].CreateFixture(fixDef);	
	
	/* create joint */
	var b2DistanceJointDef = Box2D.Dynamics.Joints.b2DistanceJointDef;
	var jointDef = new b2DistanceJointDef;
	jointDef.Initialize(bodies[bodies.length-1], bodies[bodies.length-2], bodies[bodies.length-1].GetWorldCenter(), bodies[bodies.length-2].GetWorldCenter())
	world.CreateJoint(jointDef);	
	
	/* create the pad */
	var padDef = new b2BodyDef;
	padDef.type = b2Body.b2_dynamicBody;
	padDef.position.x = canvasWidth / 2 / scale;
	padDef.position.y = canvasHeight * 0.9 / scale;
	fixDef.shape = new b2PolygonShape;
	fixDef.shape.SetAsBox(canvasWidth / 15 / scale, 5);
	bodies.push(world.CreateBody(padDef));
	bodies[bodies.length-1].CreateFixture(fixDef);
	
	/*
	 * Shapes end
	 */ 
	
	/* setup debug draw */
	var debugDraw = new b2DebugDraw();
	debugDraw.SetSprite(document.getElementById("canvas").getContext("2d"));
	debugDraw.SetDrawScale(scale);
	debugDraw.SetFillAlpha(0.3);
	debugDraw.SetLineThickness(1.0);
	debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
	
	world.SetDebugDraw(debugDraw);
    //world.DrawDebugData();
	
	/* main "loop" */	
	window.setInterval(update, 1000 / 60);	

	/* update & draw everything */
	function update() {

		world.Step(
			   1 / 60   //frame-rate
			,  10       //velocity iterations
			,  10       //position iterations
		);
		world.DrawDebugData();
		world.ClearForces();
		if (++i % 60 == 0) {
			console.log("updating...");
		}
	}	
	
	/* debug / additional */
	var mass = new b2MassData;
	mass.mass = 100;
	bodies[bodies.length-1].SetFixedRotation(true);
	bodies[bodies.length-1].SetMassData(mass);	
	
	var list = world.GetBodyList();
	var body;
	var pad;

	/* controls */
	document.onkeydown = checkKey;
	function checkKey(e) {

		e = e || window.event;

		/* xy-movement */		
		if (e.keyCode == '37') {
			console.log("left");
			bodies[bodies.length-1].SetLinearVelocity(new b2Vec2(0,0), bodies[bodies.length-1].GetWorldCenter());
			bodies[bodies.length-1].ApplyImpulse(new b2Vec2(-10000,0), bodies[bodies.length-1].GetWorldCenter());
		}
		else if (e.keyCode == '39') {
			console.log("right");
			bodies[bodies.length-1].SetLinearVelocity(new b2Vec2(0,0), bodies[bodies.length-1].GetWorldCenter());
			bodies[bodies.length-1].ApplyImpulse(new b2Vec2(10000,0), bodies[bodies.length-1].GetWorldCenter());
			}
		else if (e.keyCode == '40') {
			console.log("up");
			bodies[bodies.length-1].SetLinearVelocity(new b2Vec2(0,0), bodies[bodies.length-1].GetWorldCenter());
			bodies[bodies.length-1].ApplyImpulse(new b2Vec2(0,10000), bodies[bodies.length-1].GetWorldCenter());
		}
		else if (e.keyCode == '38') {
			console.log("down");
			bodies[bodies.length-1].SetLinearVelocity(new b2Vec2(0,0), bodies[bodies.length-1].GetWorldCenter());
			bodies[bodies.length-1].ApplyImpulse(new b2Vec2(0,-10000), bodies[bodies.length-1].GetWorldCenter());
		}
		/* rotation (not available with fixed */
		else if (e.keyCode == '65') {
			console.log("left");
			//bodies[bodies.length-1].ApplyImpulse(new b2Vec2(0,1000), bodies[bodies.length-1].GetWorldCenter() - 1);
			bodies[bodies.length-1].ApplyTorque(-100000);
		}
		else if (e.keyCode == '68') {
			console.log("right");
			bodies[bodies.length-1].ApplyTorque(100000);
			}		
	}
		
}
