<Query Kind="Statements" />

var currPath = Path.GetDirectoryName(Util.CurrentQueryPath);
var input = File.ReadAllLines($"{currPath}/../inputs/day1.txt").Select(i => int.Parse(i));
input.Sum(i => (i/3)-2 ).Dump("Part 1");

int calculateFuelRecurrsive(int w){
	var f = (w/3)-2;
	if(f<=0)
		return 0;
	else 
		return  f+calculateFuelRecurrsive(f);
}

input.Sum(calculateFuelRecurrsive).Dump("Part 2");