const Chance = require('chance');

const chance = new Chance();

const {
    cloneDeep
} = require('lodash');

const {
    usersRepository
} = require('../../../src/frameworks/repositories/inMemory');

const {
    User,
    constants: {
        userConstants: {
            genders
        }
    }
} = require('../../../src/entities');


describe('Users repository', () => {
    test('New user should be added and returned', async () => {
        const testUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'black'
                }
            }
        });

        const addedUser = await usersRepository.add(testUser);

        expect(addedUser).toBeDefined();
        expect(addedUser.id).toBeDefined();
        expect(addedUser.name).toBe(testUser.name);
        expect(addedUser.lastName).toBe(testUser.lastName);
        expect(addedUser.gender).toBe(testUser.gender);
        expect(addedUser.meta).toEqual(testUser.meta);

        const returnedUser = await usersRepository.getById(addedUser.id);
        expect(returnedUser).toEqual(addedUser);
    })

    test('New user should be deleted', async () => {
        // init two users

        const willBeDeletedUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'black'
                }
            }
        });

        const shouldStayUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'blonde'
                }
            }
        });

        // add two users

        const [willBeDeletedAddedUser, shouldStayAddedUser] = await Promise.all([usersRepository.add(willBeDeletedUser), usersRepository.add(shouldStayUser)]);
        expect(willBeDeletedAddedUser).toBeDefined();
        expect(shouldStayAddedUser).toBeDefined();
        // delete one user
        const deletedUser = await usersRepository.delete(willBeDeletedAddedUser);
        expect(deletedUser).toEqual(willBeDeletedAddedUser);

        // try to get the deleted user ( should be undefined )
        const shouldBeUndefinedUser = await usersRepository.getById(deletedUser.id);
        expect(shouldBeUndefinedUser).toBeUndefined();

        // check that the second user defined (not deleted)
        const shouldBeDefinedUser = await usersRepository.getById(shouldStayAddedUser.id);
        expect(shouldBeDefinedUser).toBeDefined();
    })
    test('New user should be updated', async () => {
        // added a user
        const testUser = new User({
            name: chance.name(),
            lastName: chance.last(),
            gender: genders.FEMALE,
            meta: {
                hair: {
                    color: 'black'
                }
            }
        });

        const addedUser = await usersRepository.add(testUser);
        expect(addedUser).toBeDefined();

        // update a user
        const clonedUser = cloneDeep({
            ...addedUser,
            name: chance.name(),
            gender: genders.MALE
        });

        const updatedUser = await usersRepository.update(clonedUser);

        expect(updatedUser).toEqual(clonedUser);

    })
});