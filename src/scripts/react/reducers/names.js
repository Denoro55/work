const initialSkills = [
	{
		id: 1,
		name: 'Den'
	},
	{
		id: 2,
		name: 'Bob'
	}
]

export default function skills(state=initialSkills,action){
	if (action.type === 'ADD_NAME'){
		return [...state,action.name]
	}
	return state
}