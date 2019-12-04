<Query Kind="Statements" />

var currPath = Path.GetDirectoryName(Util.CurrentQueryPath);
var input = File.ReadAllLines($"{currPath}/../inputs/day3.txt").Select(i=>i.Split(','));
string[] wire1 = input.First();
string[] wire2 = input.Skip(1).First();

IEnumerable<(int x,int y)> calcPath(string[] wire){
	var origin = (x: 0, y: 0);
	var path = new List<(int x, int y)>() {origin};
	foreach(var move in wire){
		char dir = move[0];
		int steps = int.Parse(move.Substring(1));
		for (int i = 1; i <= steps; i++)
		{
			var next = path.Last();
			switch(dir){
				case 'U': next.y++; break;
				case 'D': next.y--; break;
				case 'L': next.x--; break;
				case 'R': next.x++; break;
			}
			path.Add(next);
		}
	}
	return path;
}

var path1 = calcPath(wire1).ToArray();
var path2 = calcPath(wire2).ToArray();

var intersections = path1.Intersect(path2).Skip(1);

var intersectionDistFromOrig = intersections
	.Select( i=> Math.Abs(i.x)+Math.Abs(i.y))
	.OrderBy(i=>i).Take(1).Dump("Part 1");

var intersectionSteps = intersections
	.Select(i => Array.FindIndex(path1,p1=> i == p1) + Array.FindIndex(path2,p2=> i == p2))
	.OrderBy(i=>i).Take(1).Dump("Part 2");
