import { RouteHandler } from "fastify";
import { StudioHandleParams } from "../schemes/studio.schema";
import prismaService from "../services/connectors/prisma.service";

export const getStudio: RouteHandler<{ Params: StudioHandleParams }> = async (
  request,
  reply,
) => {
  const { handle } = request.params;

  try {
    const studio = await prismaService.studio.findFirst({
      where: { user: { handle } },
      select: {
        id: true,
        preferredGenres: true,
        preferredArtists: true,
        recommendedTrackArtist: true,
        recommendedTrackTitle: true,
        recommendedTrackLink: true,
        avgVocalScore: true,
        avgVisualScore: true,
        avgVibeScore: true,
        totalScore: true,
        totalLikes: true,
        totalViews: true,
        user: {
          select: {
            handle: true,
            nickname: true,
            profilePictureUrl: true,
            description: true,
            registeredAt: true,
            role: true,
          },
        },
      },
    });

    if (!studio) {
      return reply
        .status(404)
        .send({ message: "스튜디오를 찾을 수 없습니다." });
    }

    return reply.status(200).send({ studio });
  } catch (error) {
    request.log.error(error);
    return reply.status(500).send({ message: "서버 오류" });
  }
};
